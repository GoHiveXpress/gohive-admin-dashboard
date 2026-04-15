// src/app/api/customerManagement/index.ts
import { apiClient } from "@/lib/apiClient";
import { 
  CustomerListResponse, 
  OrderListResponse, 
  OrderStatsResponse,
  SingleCustomerResponse,
  CustomerFeedbackResponse,
  SingleOrderResponse
} from "@/types/customerManagement";

const ADMIN_BASE = "/admin";

export const customerApi = {
  getAllCustomers: (filters: { search?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    
    return apiClient.get<CustomerListResponse>(
      `${ADMIN_BASE}/customers?${params.toString()}`, 
      "Failed to fetch customers"
    );
  },

  getCustomerById: (id: string) => 
    apiClient.get<SingleCustomerResponse>(
      `${ADMIN_BASE}/customer/${id}`, 
      "Failed to fetch customer details"
    ),

  getCustomerOrders: (id: string) => 
    apiClient.get<OrderListResponse>(
      `${ADMIN_BASE}/customer/${id}/orders`, 
      "Failed to fetch customer orders"
    ),

  getCustomerFeedback: (id: string) => 
    apiClient.get<CustomerFeedbackResponse>(
      `${ADMIN_BASE}/customer/${id}/feedback`, 
      "Failed to fetch customer feedback"
    ),

  getAllOrders: (filters: { search?: string; status?: string; vendor?: string }) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.vendor) params.append("vendor", filters.vendor);
    
    return apiClient.get<OrderListResponse>(
      `${ADMIN_BASE}/orders?${params.toString()}`, 
      "Failed to fetch orders"
    );
  },

  getOrderById: (id: string) => 
    apiClient.get<SingleOrderResponse>(
      `${ADMIN_BASE}/order/${id}`, 
      "Failed to fetch order details"
    ),

  getOrderStats: () => 
    apiClient.get<OrderStatsResponse>(
      `${ADMIN_BASE}/order-stats`, 
      "Failed to fetch order stats"
    ),
};

