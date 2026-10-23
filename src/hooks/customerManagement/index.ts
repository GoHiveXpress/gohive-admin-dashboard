// src/hooks/customerManagement/index.ts
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { customerApi } from "@/app/api/customerManagement";
import { useOpsLiveUpdates } from "@/hooks/useOps";

// The customer list hooks. They share the ["customers", ...] cache with the
// account status and role mutations in hooks/userManagement, so a suspension
// refreshes every customer list. Single customers: useCustomer in hooks/userManagement.
export const useCustomers = (filters: { search?: string; status?: string } = {}) => {
	return useQuery({
		queryKey: ["customers", filters],
		queryFn: () => customerApi.getAllCustomers(filters),
	});
};

// Server-paginated variant; keeps the previous page on screen while the next loads.
export const usePaginatedCustomers = (filters: {
	search?: string;
	status?: string;
	page: number;
	limit: number;
}) => {
	return useQuery({
		queryKey: ["customers", "paged", filters],
		queryFn: () => customerApi.getAllCustomers(filters),
		placeholderData: keepPreviousData,
	});
};

export const useCustomerOrders = (id: string) => {
	return useQuery({
		queryKey: ["admin_customer_orders", id],
		queryFn: () => customerApi.getCustomerOrders(id),
		enabled: !!id,
	});
};

export const useCustomerFeedback = (id: string) => {
	return useQuery({
		queryKey: ["admin_customer_feedback", id],
		queryFn: () => customerApi.getCustomerFeedback(id),
		enabled: !!id,
	});
};

export const useOrders = (
	filters: { search?: string; status?: string; vendor?: string },
	options: { enabled?: boolean } = {},
) => {
	return useQuery({
		queryKey: ["admin_orders", filters],
		queryFn: () => customerApi.getAllOrders(filters),
		enabled: options.enabled ?? true,
	});
};

// The newest orders only (the server's page cap), for overview screens that
// used to download every order ever placed.
export const RECENT_ORDERS_LIMIT = 200;
export const useRecentOrders = () => {
	return useQuery({
		queryKey: ["admin_orders", "recent"],
		queryFn: () => customerApi.getAllOrders({ page: 1, limit: RECENT_ORDERS_LIMIT }),
	});
};

export const usePaginatedOrders = (
	filters: {
		search?: string;
		status?: string;
		vendor?: string;
		customer?: string;
		date?: string;
		page: number;
		limit: number;
	},
	options: { enabled?: boolean } = {},
) => {
	return useQuery({
		queryKey: ["admin_orders", "paged", filters],
		queryFn: () => customerApi.getAllOrders(filters),
		placeholderData: keepPreviousData,
		enabled: options.enabled ?? true,
	});
};

// Order changes arrive over the admin socket; the timer only covers staff the
// server keeps out of the live room and a dropped connection.
export const useOrder = (id: string) => {
	useOpsLiveUpdates(!!id);
	return useQuery({
		queryKey: ["admin_order", id],
		queryFn: () => customerApi.getOrderById(id),
		enabled: !!id,
		refetchInterval: 30 * 1000,
	});
};

export const useOrderStats = () => {
	return useQuery({
		queryKey: ["admin_order_stats"],
		queryFn: customerApi.getOrderStats,
		// Poll every 30 seconds for live updates if needed
		refetchInterval: 30000,
	});
};

export const useAlertVendor = () => {
	return useMutation({
		mutationFn: ({ orderId, message }: { orderId: string; message?: string }) =>
			customerApi.alertVendor(orderId, message),
	});
};
