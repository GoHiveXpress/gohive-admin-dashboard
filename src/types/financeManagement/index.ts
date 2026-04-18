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
