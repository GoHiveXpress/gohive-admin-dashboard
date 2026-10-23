// src/hooks/financeManagement/index.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "@/app/api/financeManagement";
import { type RefundRequestStatus } from "@/types/financeManagement";

export const REFUND_REQUESTS_KEY = ["refundRequests"];

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

export const useRefundLogs = (
	filters: { search?: string; status?: string; date?: string },
	options: { enabled?: boolean } = {},
) => {
	return useQuery({
		queryKey: ["refundLogs", filters],
		queryFn: () => financeApi.getRefundLogs(filters),
		enabled: options.enabled ?? true,
	});
};

export const useProcessRefund = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			idempotencyKey,
			...data
		}: {
			orderId: string;
			amount: number;
			reason: string;
			cancelOrder?: boolean;
			idempotencyKey: string;
		}) => financeApi.processRefund(data, idempotencyKey),
		// A refund can cancel the order, so orders are refetched too
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["refundLogs"] }),
				queryClient.invalidateQueries({ queryKey: REFUND_REQUESTS_KEY }),
				queryClient.invalidateQueries({ queryKey: ["admin_orders"] }),
			]),
	});
};

export const useRefundRequests = (
	status: RefundRequestStatus | "all",
	options: { enabled?: boolean } = {},
) =>
	useQuery({
		queryKey: [...REFUND_REQUESTS_KEY, status],
		queryFn: () => financeApi.getRefundRequests(status),
		enabled: options.enabled ?? true,
		refetchInterval: 60 * 1000,
	});

export const useDecideRefundRequest = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			decision,
			note,
		}: {
			id: string;
			decision: "approve" | "reject";
			note?: string;
		}) => financeApi.decideRefundRequest(id, decision, note),
		// Refetch whatever happened: a failed approval also changes the request.
		onSettled: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: REFUND_REQUESTS_KEY }),
				queryClient.invalidateQueries({ queryKey: ["refundLogs"] }),
				queryClient.invalidateQueries({ queryKey: ["admin_orders"] }),
			]),
	});
};

// Reads every wallet and transaction, so it only refetches when asked.
export const useWalletReconciliation = () =>
	useQuery({
		queryKey: ["walletReconciliation"],
		queryFn: () => financeApi.getWalletReconciliation(),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
