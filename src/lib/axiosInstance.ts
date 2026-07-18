// src/lib/axiosInstance.ts

"use client";

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAuthToken, clearAuth } from "@/utils/auth";
import { toast } from "sonner";
// eslint-disable-next-line import/no-named-as-default
import env from "@/env";

const axiosInstance = axios.create({
	baseURL: env.NEXT_PUBLIC_ADMIN_API_BASE_URL,
	timeout: 15_000,
	headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = await getAuthToken();
		if (token) {
			config.headers.set("Authorization", `Bearer ${token}`);
		}
		return config;
	},
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error: AxiosError<{ message?: string }>) => {
		const errResponse = error.response;
		if (error.code === "ECONNABORTED") {
			toast.error("Request timed out. Please try again.");
			return Promise.reject(error);
		}

		// Only handle 401 if token exists (i.e., user is logged in)
		const tokenExists = !!localStorage.getItem("token"); // same as AUTH_TOKEN_KEY
		if (errResponse?.status === 401 && tokenExists) {
			const errorMessage =
				errResponse.data?.message ?? "Session expired, please log in again.";
			clearAuth();
			toast.error(errorMessage);
			if (typeof window !== "undefined") window.location.href = "/login";
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
