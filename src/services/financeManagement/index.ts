// src/services/financeManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type VendorPayoutResponse,
	type RiderEarningResponse,
	type RefundLogResponse,
	type RefundRequestListResponse,
	type RefundRequestStatus,
	type ProcessRefundResponse,
	type WalletReconciliationResponse,
	type WalletAdjustment,
	type WalletAdjustmentListResponse,
	type WalletAdjustmentPayload,
	type WalletAdjustmentStatus,
	type PromoCode,
	type PromoCodePayload,
	type DeliverySurge,
	type DeliverySurgeListResponse,
	type DeliverySurgePayload,
	type MoneyActionResponse,
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

	// The key makes a retried submit return the first answer instead of paying twice.
	processRefund: (
		data: {
			orderId: string;
			amount: number;
			reason: string;
			cancelOrder?: boolean;
		},
		idempotencyKey: string,
	) =>
		apiClient.post<ProcessRefundResponse>(
			`${ADMIN_BASE}/process-refund`,
			data,
			"Failed to process refund",
			{ headers: { "Idempotency-Key": idempotencyKey } },
		),

	getWalletReconciliation: () =>
		apiClient.get<WalletReconciliationResponse>(
			`${ADMIN_BASE}/reconciliation/wallets`,
			"Failed to reconcile wallets",
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
			// A request is decided once, so the same decision on it is the same action.
			{ headers: { "Idempotency-Key": `refund-${decision}-${id}` } },
		),

	getWalletAdjustments: (status: WalletAdjustmentStatus | "all") =>
		apiClient.get<WalletAdjustmentListResponse>(
			`${ADMIN_BASE}/wallet-adjustments?status=${status}`,
			"Failed to load wallet adjustments",
		),

	requestWalletAdjustment: (data: WalletAdjustmentPayload, idempotencyKey: string) =>
		apiClient.post<MoneyActionResponse<WalletAdjustment>>(
			`${ADMIN_BASE}/wallet-adjustments`,
			data,
			"Failed to request the adjustment",
			{ headers: { "Idempotency-Key": idempotencyKey } },
		),

	decideWalletAdjustment: (id: string, decision: "approve" | "reject", note?: string) =>
		apiClient.post<MoneyActionResponse<WalletAdjustment>>(
			`${ADMIN_BASE}/wallet-adjustments/${id}/${decision}`,
			{ note },
			decision === "approve"
				? "Failed to approve the adjustment"
				: "Failed to reject the adjustment",
			{ headers: { "Idempotency-Key": `adjustment-${decision}-${id}` } },
		),

	getPromoCodes: () =>
		apiClient.get<{ success: boolean; data: PromoCode[] }>(
			`${ADMIN_BASE}/promo-codes`,
			"Failed to load promo codes",
		),

	createPromoCode: (data: PromoCodePayload) =>
		apiClient.post<MoneyActionResponse<PromoCode>>(
			`${ADMIN_BASE}/promo-codes`,
			data,
			"Failed to create the promo code",
		),

	updatePromoCode: (id: string, data: PromoCodePayload) =>
		apiClient.patch<MoneyActionResponse<PromoCode>>(
			`${ADMIN_BASE}/promo-codes/${id}`,
			data,
			"Failed to save the promo code",
		),

	getDeliverySurges: () =>
		apiClient.get<DeliverySurgeListResponse>(
			`${ADMIN_BASE}/delivery-surges`,
			"Failed to load delivery surges",
		),

	startDeliverySurge: (data: DeliverySurgePayload) =>
		apiClient.post<MoneyActionResponse<DeliverySurge>>(
			`${ADMIN_BASE}/delivery-surges`,
			data,
			"Failed to start the surge",
		),

	endDeliverySurge: (id: string) =>
		apiClient.post<MoneyActionResponse<DeliverySurge>>(
			`${ADMIN_BASE}/delivery-surges/${id}/end`,
			{},
			"Failed to end the surge",
		),
};

/* eslint-enable */
