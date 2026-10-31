// src/types/financeManagement/index.ts

export type VendorPayout = {
	id: string;
	vendorName: string;
	vendorId: string;
	orderVolume: number;
	todayEarnings: number;
	earnings: number;
	payout: number;
	commission: number;
	totalBalance: number;
};

export type RiderEarning = {
	id: string;
	name: string;
	riderId: string;
	completedTrips: number;
	todayEarnings: number;
	earnings: number;
	payout: number;
	incentives: number;
	totalBalance: number;
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

export interface WalletMismatch {
	userId: string;
	name: string | null;
	email: string | null;
	phone: string | null;
	role: string | null;
	// What the wallet holds vs what its records say it should
	actual: number;
	expected: number;
	// actual - expected: positive means more money than the records explain
	difference: number;
	completedCredits: number;
	returnedRefundCredits: number;
	activeDebits: number;
	walletOrderSpend: number;
}

export interface WalletReconciliationResponse {
	success: boolean;
	data: {
		checkedAt: string;
		tolerance: number;
		summary: {
			walletCount: number;
			totalActual: number;
			totalExpected: number;
			netDifference: number;
			mismatchCount: number;
			surplus: number;
			shortfall: number;
		};
		mismatches: WalletMismatch[];
		truncated: boolean;
	};
}

export type WalletAdjustmentStatus = "pending" | "approved" | "rejected" | "withdrawn" | "failed";

export interface WalletAdjustment {
	_id: string;
	user: {
		_id: string;
		name?: string;
		email?: string;
		phone?: string;
		role?: string;
		vendorProfile?: { businessName?: string };
	} | null;
	type: "credit" | "debit";
	amount: number;
	reason: string;
	order?: { _id: string; orderId: string } | null;
	status: WalletAdjustmentStatus;
	requestedBy: string;
	requestedByName?: string;
	decidedByName?: string;
	decidedAt?: string;
	decisionNote?: string;
	failureReason?: string;
	createdAt: string;
	// Computed for the signed-in admin
	canApprove: boolean;
	isMine: boolean;
}

export interface WalletAdjustmentListResponse {
	success: boolean;
	data: WalletAdjustment[];
	pendingCount: number;
	maxAmount: number;
}

export interface WalletAdjustmentPayload {
	// Email, phone or user id
	account: string;
	type: "credit" | "debit";
	amount: number;
	reason: string;
	// GH- code or order id
	order?: string;
}

export type PromoType = "percent" | "fixed" | "free_delivery";

export interface PromoCode {
	_id: string;
	code: string;
	description?: string;
	type: PromoType;
	value: number;
	maxDiscount?: number;
	minSubtotal?: number;
	startsAt?: string;
	endsAt?: string;
	usageLimit?: number;
	perCustomerLimit?: number;
	firstOrderOnly: boolean;
	states: string[];
	active: boolean;
	createdByName?: string;
	createdAt: string;
	// From orders that went through
	uses: number;
	discountGiven: number;
}

export interface PromoCodePayload {
	code?: string;
	type?: PromoType;
	description?: string;
	value?: number | "";
	maxDiscount?: number | "";
	minSubtotal?: number | "";
	startsAt?: string;
	endsAt?: string;
	usageLimit?: number | "";
	perCustomerLimit?: number | "";
	firstOrderOnly?: boolean;
	states?: string[];
	active?: boolean;
}

export interface DeliverySurge {
	_id: string;
	state: string | null;
	multiplier: number;
	reason: string;
	startsAt: string;
	endsAt?: string;
	endedAt?: string;
	createdByName?: string;
	createdAt: string;
}

export interface DeliverySurgeListResponse {
	success: boolean;
	data: { live: DeliverySurge[]; past: DeliverySurge[] };
}

export interface DeliverySurgePayload {
	state?: string;
	multiplier: number;
	reason: string;
	hours?: number;
}

export interface MoneyActionResponse<T> {
	success: boolean;
	message: string;
	data: T;
}
