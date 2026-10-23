// src/lib/axiosInstance.ts

"use client";

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAuthToken, clearAuth } from "@/utils/auth";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const adminApiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "http://localhost:5000/api";

const axiosInstance = axios.create({
	baseURL: adminApiBaseUrl,
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

		// A signed-in request was refused: end the NextAuth session too, or the
		// middleware sends /login straight back to a dashboard full of failing calls.
		// Requests without a token (login, 2FA, staff sign-up) show their own errors.
		const sentToken = Boolean(error.config?.headers?.Authorization);
		if (errResponse?.status === 401 && sentToken && typeof window !== "undefined") {
			const errorMessage =
				errResponse.data?.message ?? "Session expired, please log in again.";
			clearAuth();
			toast.error(errorMessage, { id: "session-expired" });
			signOut({ callbackUrl: "/login" }).catch(() => {
				window.location.href = "/login";
			});
		}

		// Permission denied: show the backend's reason ("Requires permission: ...").
		// The toast id is the message, so callers that also toast error.message
		// update this toast instead of stacking a second one.
		if (errResponse?.status === 403) {
			const errorMessage =
				errResponse.data?.message ?? "You don't have permission to do that.";
			toast.error(errorMessage, { id: errorMessage });
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
