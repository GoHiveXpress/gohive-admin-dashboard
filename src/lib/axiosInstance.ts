// src/lib/axiosInstance.ts
"use client";

import axios, { type AxiosError } from "axios";
import { getAuthToken, clearAuth } from "@/utils/auth";
import { toast } from "sonner";
import env from "@src/env";

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_ADMIN_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const errResponse = error.response;

    // Only handle 401 if token exists (i.e., user is logged in)
    const tokenExists = !!localStorage.getItem("token"); // same as AUTH_TOKEN_KEY
    if (errResponse?.status === 401 && tokenExists) {
      const errorMessage = errResponse.data?.message ?? "Session expired, please log in again.";
      clearAuth();
      toast.error(errorMessage);
      if (typeof window !== "undefined") window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
