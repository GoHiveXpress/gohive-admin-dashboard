// src/hooks/customerManagement/index.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { customerApi } from "@/services/customerManagement";
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
		range?: "today" | "week" | "month";
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

// Order intervention. Each change refreshes the order lists, the open order and
// the status counts; toasts are left to the panel that started it.
const useOrderChange = <V, R>(mutationFn: (vars: V) => Promise<R>) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["admin_orders"] }),
				queryClient.invalidateQueries({ queryKey: ["admin_order"] }),
				queryClient.invalidateQueries({ queryKey: ["admin_order_stats"] }),
			]);
		},
	});
};

export const useCancelOrder = () =>
	useOrderChange(({ id, reason, refund }: { id: string; reason: string; refund: boolean }) =>
		customerApi.cancelOrder(id, { reason, refund }),
	);

export const useChangeOrderRider = () =>
	useOrderChange(
		({ id, riderId, reason }: { id: string; riderId: string | null; reason?: string }) =>
			customerApi.changeOrderRider(id, { riderId, reason }),
	);

export const useOverrideOrderStatus = () =>
	useOrderChange(({ id, status, reason }: { id: string; status: string; reason: string }) =>
		customerApi.overrideOrderStatus(id, { status, reason }),
	);

export const useOrderNotes = (id?: string) => {
	return useQuery({
		queryKey: ["admin_order_notes", id],
		queryFn: () => customerApi.getOrderNotes(id ?? ""),
		enabled: Boolean(id),
	});
};

export const useAddOrderNote = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, text }: { id: string; text: string }) =>
			customerApi.addOrderNote(id, text),
		onSuccess: async (_data, { id }) => {
			await queryClient.invalidateQueries({ queryKey: ["admin_order_notes", id] });
		},
	});
};
