// src/app/api/financeManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type VendorPayoutResponse,
	type RiderEarningResponse,
	type RefundLogResponse,
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
		apiClient.post<{
			success: boolean;
			message: string;
			data: { orderId: string; amount: number; cancelled: boolean };
		}>(`${ADMIN_BASE}/process-refund`, data, "Failed to process refund"),
};

/* eslint-enable */
