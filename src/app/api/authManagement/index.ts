// src/app/api/authManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type LoginRequest,
	type LoginResponse,
	type VerifyOtpRequest,
	type ResendOtpRequest,
	type AuthResponse,
	type RegisterStaffRequest,
} from "@/types/authManagement";

const AUTH_BASE = "/auth";

export const authApi = {
	// Login: Can return token OR requireOtp flag
	login: (data: LoginRequest) =>
		apiClient.post<LoginResponse>(`${AUTH_BASE}/login`, data, "Login failed"),

	// Verify OTP: Returns final token
	verifyOtp: (data: VerifyOtpRequest) =>
		apiClient.post<AuthResponse>(`${AUTH_BASE}/verify-otp`, data, "Verification failed"),

	// Resend OTP
	resendOtp: (data: ResendOtpRequest) =>
		apiClient.post<{ success: boolean; message: string }>(
			`${AUTH_BASE}/resend-otp`,
			data,
			"Failed to resend OTP",
		),

	// Staff registration
	registerStaff: (data: RegisterStaffRequest) =>
		apiClient.post<{ success: boolean; message: string }>(
			`${AUTH_BASE}/register-staff`,
			data,
			"Staff registration failed",
		),
};

/* eslint-enable */
