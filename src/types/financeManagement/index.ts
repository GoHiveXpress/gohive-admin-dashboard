// src/types/financeManagement/index.ts

export type VendorPayout = {
	id: string;
	vendorName: string;
	vendorId: string;
	orderVolume: number;
	todayEarnings: string;
	earnings: string;
	payout: string;
	commission: string;
	totalBalance: string;
};

export type RiderEarning = {
	id: string;
	name: string;
	riderId: string;
	completedTrips: number;
	todayEarnings: string;
	earnings: string;
	payout: string;
	incentives: string;
	totalBalance: string;
};

export type RefundLog = {
	id: string;
	orderId: string;
	dbOrderId: string;
	status: string;
	reason: string;
	refundAmount: string;
	createdAt: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped order snapshot read by RefundLogTab
	orderDetails?: any;
};

export interface VendorPayoutResponse {
	success: boolean;
	data: VendorPayout[];
}

export interface RiderEarningResponse {
	success: boolean;
	data: RiderEarning[];
}

export interface RefundLogResponse {
	success: boolean;
	data: RefundLog[];
}

// Refunds over the approval threshold wait for a second admin with Finance access.
export type RefundRequestStatus = "pending" | "approved" | "rejected" | "withdrawn" | "failed";

export interface RefundRequest {
	_id: string;
	order: {
		_id: string;
		orderId: string;
		status: string;
		totalAmount: number;
		paymentMethod?: string;
		createdAt: string;
	} | null;
	orderCode?: string;
	customer: { _id: string; name?: string; phone?: string; email?: string } | null;
	amount: number;
	reason?: string;
	cancelOrder: boolean;
	status: RefundRequestStatus;
	requestedBy: string;
	requestedByName?: string;
	decidedBy?: string;
	decidedByName?: string;
	decidedAt?: string;
	decisionNote?: string;
	failureReason?: string;
	createdAt: string;
	// Computed for the signed-in admin
	canApprove: boolean;
	isMine: boolean;
}

export interface RefundRequestListResponse {
	success: boolean;
	data: RefundRequest[];
	threshold: number;
	pendingCount: number;
}

export interface ProcessRefundResponse {
	success: boolean;
	message: string;
	// true when the refund was held for a second admin instead of paid
	pendingApproval?: boolean;
	data: { orderId: string; amount: number; cancelled?: boolean; requestId?: string };
}
