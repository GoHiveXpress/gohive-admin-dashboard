// src/hooks/financeManagement/index.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "@/app/api/financeManagement";

export const useVendorPayouts = (filters: { search?: string; range?: string; date?: string }) => {
	return useQuery({
		queryKey: ["vendorPayouts", filters],
		queryFn: () => financeApi.getVendorPayouts(filters),
	});
};

export const useRiderEarnings = (filters: { search?: string; range?: string; date?: string }) => {
	return useQuery({
		queryKey: ["riderEarnings", filters],
		queryFn: () => financeApi.getRiderEarnings(filters),
	});
};

export const useRefundLogs = (filters: { search?: string; status?: string; date?: string }) => {
	return useQuery({
		queryKey: ["refundLogs", filters],
		queryFn: () => financeApi.getRefundLogs(filters),
	});
};

export const useProcessRefund = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { orderId: string; amount: number; reason: string }) =>
			financeApi.processRefund(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["refundLogs"] });
		},
	});
};
