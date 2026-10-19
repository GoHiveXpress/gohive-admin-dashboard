// src/app/api/financeManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type VendorPayoutResponse,
	type RiderEarningResponse,
	type RefundLogResponse,
	type RefundRequestListResponse,
	type RefundRequestStatus,
	type ProcessRefundResponse,
} from "@/types/financeManagement";

const ADMIN_BASE = "/admin";

export const financeApi = {
	getVendorPayouts: (filters: { search?: string; range?: string; date?: string }) => {
		const params = new URLSearchParams();
		if (filters.search) params.append("search", filters.search);
		if (filters.range) params.append("range", filters.range);
		if (filters.date) params.append("date", filters.date);

		return apiClient.get<VendorPayoutResponse>(
			`${ADMIN_BASE}/vendor-payouts?${params.toString()}`,
			"Failed to fetch vendor payouts",
		);
	},

	getRiderEarnings: (filters: { search?: string; range?: string; date?: string }) => {
		const params = new URLSearchParams();
		if (filters.search) params.append("search", filters.search);
		if (filters.range) params.append("range", filters.range);
		if (filters.date) params.append("date", filters.date);

		return apiClient.get<RiderEarningResponse>(
			`${ADMIN_BASE}/rider-earnings?${params.toString()}`,
			"Failed to fetch rider earnings",
		);
	},

	getRefundLogs: (filters: { search?: string; status?: string; date?: string }) => {
		const params = new URLSearchParams();
		if (filters.search) params.append("search", filters.search);
		if (filters.status) params.append("status", filters.status);
		if (filters.date) params.append("date", filters.date);

		return apiClient.get<RefundLogResponse>(
			`${ADMIN_BASE}/refund-logs?${params.toString()}`,
			"Failed to fetch refund logs",
		);
	},

	processRefund: (data: {
		orderId: string;
		amount: number;
		reason: string;
		cancelOrder?: boolean;
	}) =>
		apiClient.post<ProcessRefundResponse>(
			`${ADMIN_BASE}/process-refund`,
			data,
			"Failed to process refund",
		),

	getRefundRequests: (status: RefundRequestStatus | "all") =>
		apiClient.get<RefundRequestListResponse>(
			`${ADMIN_BASE}/refund-requests?status=${status}`,
			"Failed to load refund approvals",
		),

	decideRefundRequest: (id: string, decision: "approve" | "reject", note?: string) =>
		apiClient.post<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/refund-requests/${id}/${decision}`,
			{ note },
			decision === "approve" ? "Failed to approve refund" : "Failed to reject refund",
		),
};

/* eslint-enable */
