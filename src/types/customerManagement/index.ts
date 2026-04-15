// src/types/customerManagement/index.ts

export type Customer = {
	_id: string;
	name: string;
	email: string;
	phone: string;
	accountStatus: "Active" | "Inactive" | "Suspend";
	orderCount: number;
	createdAt: string;
	dob?: string;
	location?: {
		address: string;
	};
};

export type Order = {
	_id: string;
	orderId: string;
	customer: {
		_id: string;
		name: string;
		email: string;
		phone: string;
	};
	vendor: {
		vendorProfile: {
			businessName: string;
		};
	};
	rider?: {
		name: string;
		phone: string;
	};
	status:
		| "pending"
		| "payment_failed"
		| "placed"
		| "accepted"
		| "preparing"
		| "ready"
		| "picked_up"
		| "delivered"
		| "rejected"
		| "cancelled"
		| "expired";
	totalAmount: number;
	createdAt: string;
	deliveryAddress?: {
		address: string;
	};
};

export type OrderStats = {
	pending: number;
	payment_failed: number;
	placed: number;
	accepted: number;
	preparing: number;
	ready: number;
	picked_up: number;
	delivered: number;
	rejected: number;
	cancelled: number;
	expired: number;
};

export type CustomerFeedback = {
	_id: string;
	customer: string;
	vendor: {
		vendorProfile: {
			businessName: string;
		};
	};
	rating: number;
	comment: string;
	createdAt: string;
};

export interface CustomerListResponse {
	success: boolean;
	data: Customer[];
}

export interface SingleCustomerResponse {
	success: boolean;
	data: Customer;
}

export interface SingleOrderResponse {
	success: boolean;
	data: Order;
}

export interface OrderListResponse {
	success: boolean;
	data: Order[];
}

export interface OrderStatsResponse {
	success: boolean;
	data: OrderStats;
}

export interface CustomerFeedbackResponse {
	success: boolean;
	data: CustomerFeedback[];
}
