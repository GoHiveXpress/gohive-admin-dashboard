// src/app/api/authManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type LoginRequest,
	type LoginResponse,
	type VerifyOtpRequest,
	type AuthResponse,
	type CustomerListResponse,
} from "@/types/authManagement";

const AUTH_BASE = "/auth";
const ADMIN_BASE = "/admin";

export const authApi = {
	// Login: Can return token OR requireOtp flag
	login: (data: LoginRequest) =>
		apiClient.post<LoginResponse>(`${AUTH_BASE}/login`, data, "Login failed"),

	// Verify OTP: Returns final token
	verifyOtp: (data: VerifyOtpRequest) =>
		apiClient.post<AuthResponse>(`${AUTH_BASE}/verify-otp`, data, "Verification failed"),

	// Resend OTP
	resendOtp: (email: string) =>
		apiClient.post<{ success: boolean; message: string }>(
			`${AUTH_BASE}/resend-otp`,
			{ email },
			"Failed to resend OTP",
		),

	// --- Customer Management (Part of Auth/User management per prompt) ---
	getAllCustomers: () =>
		apiClient.get<CustomerListResponse>(`${ADMIN_BASE}/customers`, "Failed to fetch customers"),
};

/* eslint-enable */
