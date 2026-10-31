// src/types/customerManagement/index.ts

import { type PaginationMeta } from "@/types/pagination";

export type Customer = {
	_id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture?: string;
	accountStatus: "Active" | "Inactive" | "Suspend" | "Deleted";
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
		_id?: string;
		name?: string;
		email?: string;
		phone?: string;
		vendorProfile: {
			businessName: string;
		};
	};
	rider?: {
		_id?: string;
		name: string;
		email?: string;
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
	paymentStatus?: "pending" | "completed" | "failed";
	paymentMethod?: string;
	createdAt: string;
	updatedAt?: string;
	orderAcceptedAt?: string;
	orderReadyAt?: string;
	riderAssignedAt?: string;
	orderPickedUpAt?: string;
	orderDeliveredAt?: string;
	orderEndedAt?: string;
	paymentFailedAt?: string;
	items?: { quantity: number; name?: string }[];
	estimatedTime?: string;
	deliveryAddress?: {
		address: string;
	};
};

// Internal staff note on an order (GET/POST /admin/order/:id/notes).
export type OrderNote = {
	_id: string;
	text: string;
	authorName?: string;
	author?: string;
	createdAt: string;
};

export type OrderNotesResponse = {
	success: boolean;
	data: OrderNote[];
};

export type OrderActionResponse<T = Record<string, unknown>> = {
	success: boolean;
	message: string;
	data: T;
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

// `pagination` is only present when ?page or ?limit was sent.
export interface CustomerListResponse {
	success: boolean;
	data: Customer[];
	pagination?: PaginationMeta;
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
	pagination?: PaginationMeta;
}

export interface OrderStatsResponse {
	success: boolean;
	data: OrderStats;
}

export interface CustomerFeedbackResponse {
	success: boolean;
	data: CustomerFeedback[];
}
