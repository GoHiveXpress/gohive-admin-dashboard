// src/hooks/customerManagement/index.ts
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "@/app/api/customerManagement";

export const useCustomers = (filters: { search?: string; status?: string }) => {
	return useQuery({
		queryKey: ["admin_customers", filters],
		queryFn: () => customerApi.getAllCustomers(filters),
	});
};

export const useCustomer = (id: string) => {
	return useQuery({
		queryKey: ["admin_customer", id],
		queryFn: () => customerApi.getCustomerById(id),
		enabled: !!id,
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

export const useOrders = (filters: { search?: string; status?: string; vendor?: string }) => {
	return useQuery({
		queryKey: ["admin_orders", filters],
		queryFn: () => customerApi.getAllOrders(filters),
	});
};

export const useOrder = (id: string) => {
	return useQuery({
		queryKey: ["admin_order", id],
		queryFn: () => customerApi.getOrderById(id),
		enabled: !!id,
		refetchInterval: 5000, // Poll every 5 seconds for real-time updates
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
