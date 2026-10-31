// src/services/customerManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type CustomerListResponse,
	type OrderListResponse,
	type OrderStatsResponse,
	type SingleCustomerResponse,
	type CustomerFeedbackResponse,
	type SingleOrderResponse,
	type OrderNote,
	type OrderNotesResponse,
	type OrderActionResponse,
} from "@/types/customerManagement";

const ADMIN_BASE = "/admin";

export const customerApi = {
	// Sending page/limit switches the backend to a paginated { data, pagination } reply.
	getAllCustomers: (filters: {
		search?: string;
		status?: string;
		page?: number;
		limit?: number;
	}) => {
		const params = new URLSearchParams();
		if (filters.search) params.append("search", filters.search);
		if (filters.status) params.append("status", filters.status);
		if (filters.page) params.append("page", String(filters.page));
		if (filters.limit) params.append("limit", String(filters.limit));

		return apiClient.get<CustomerListResponse>(
			`${ADMIN_BASE}/customers?${params.toString()}`,
			"Failed to fetch customers",
		);
	},

	getCustomerById: (id: string) =>
		apiClient.get<SingleCustomerResponse>(
			`${ADMIN_BASE}/customer/${id}`,
			"Failed to fetch customer details",
		),

	getCustomerOrders: (id: string) =>
		apiClient.get<OrderListResponse>(
			`${ADMIN_BASE}/customer/${id}/orders`,
			"Failed to fetch customer orders",
		),

	getCustomerFeedback: (id: string) =>
		apiClient.get<CustomerFeedbackResponse>(
			`${ADMIN_BASE}/customer/${id}/feedback`,
			"Failed to fetch customer feedback",
		),

	getAllOrders: (filters: {
		search?: string;
		status?: string;
		vendor?: string;
		customer?: string;
		date?: string;
		range?: "today" | "week" | "month";
		page?: number;
		limit?: number;
	}) => {
		const params = new URLSearchParams();
		if (filters.search) params.append("search", filters.search);
		if (filters.status) params.append("status", filters.status);
		if (filters.vendor) params.append("vendor", filters.vendor);
		if (filters.customer) params.append("customer", filters.customer);
		if (filters.date) params.append("date", filters.date);
		if (filters.range) params.append("range", filters.range);
		if (filters.page) params.append("page", String(filters.page));
		if (filters.limit) params.append("limit", String(filters.limit));

		return apiClient.get<OrderListResponse>(
			`${ADMIN_BASE}/orders?${params.toString()}`,
			"Failed to fetch orders",
		);
	},

	getOrderById: (id: string) =>
		apiClient.get<SingleOrderResponse>(
			`${ADMIN_BASE}/order/${id}`,
			"Failed to fetch order details",
		),

	getOrderStats: () =>
		apiClient.get<OrderStatsResponse>(
			`${ADMIN_BASE}/order-stats`,
			"Failed to fetch order stats",
		),

	alertVendor: (orderId: string, message?: string) =>
		apiClient.post<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/vendor-alert`,
			{ orderId, message },
			"Failed to alert vendor",
		),

	// Order intervention (gohive-backend controllers/admin/orderInterventionController.js)
	cancelOrder: (id: string, body: { reason: string; refund: boolean }) =>
		apiClient.post<OrderActionResponse<{ orderId: string; status: string; refunded: boolean }>>(
			`${ADMIN_BASE}/order/${id}/cancel`,
			body,
			"Failed to cancel order",
		),

	// riderId null takes the rider off the order.
	changeOrderRider: (id: string, body: { riderId: string | null; reason?: string }) =>
		apiClient.post<
			OrderActionResponse<{ orderId: string; rider: { _id: string; name: string } | null }>
		>(`${ADMIN_BASE}/order/${id}/rider`, body, "Failed to change rider"),

	overrideOrderStatus: (id: string, body: { status: string; reason: string }) =>
		apiClient.post<OrderActionResponse<{ orderId: string; status: string }>>(
			`${ADMIN_BASE}/order/${id}/status`,
			body,
			"Failed to update order status",
		),

	getOrderNotes: (id: string) =>
		apiClient.get<OrderNotesResponse>(
			`${ADMIN_BASE}/order/${id}/notes`,
			"Failed to fetch notes",
		),

	addOrderNote: (id: string, text: string) =>
		apiClient.post<OrderActionResponse<OrderNote>>(
			`${ADMIN_BASE}/order/${id}/notes`,
			{ text },
			"Failed to add note",
		),
};

/* eslint-enable */
