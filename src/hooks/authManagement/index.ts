// src/hooks/authManagement/index.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { authApi } from "@/app/api/authManagement";
import { type LoginRequest } from "@/types/authManagement";

// --- LOGIN HOOK ---
export const useAdminLogin = () => {
	const toast = useToast();

	return useMutation({
		// 👈 MANUALLY INJECT isAdmin: true HERE
		mutationFn: (data: LoginRequest) => authApi.login({ ...data, isAdmin: true }),

		onSuccess: (data) => {
			if (data.success && !data.requireOtp) {
				toast.success("Login Successful");
			} else if (data.requireOtp) {
				toast.info("OTP Sent", { description: "Please check your email." });
			}
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

// --- VERIFY OTP HOOK ---
export const useVerifyAdminOtp = () => {
	const toast = useToast();

	return useMutation({
		mutationFn: authApi.verifyOtp,
		onSuccess: () => {
			toast.success("Verification Successful");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

// --- RESEND OTP HOOK ---
export const useResendOtp = () => {
	const toast = useToast();

	return useMutation({
		mutationFn: authApi.resendOtp,
		onSuccess: () => {
			toast.success("OTP Code sent successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

// --- CUSTOMER QUERY HOOK ---
export const useCustomers = () => {
	return useQuery({
		queryKey: ["customers"],
		queryFn: authApi.getAllCustomers,
	});
};

/* eslint-enable */
