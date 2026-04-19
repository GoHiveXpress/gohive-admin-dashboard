// src/app/api/userManagement/index.ts
import { apiClient } from "@/lib/apiClient";
import {
	CustomerUser,
	VendorUser,
	RiderUser,
	AdminUser,
	UserListResponse,
	GenericResponse,
} from "@/types/userManagement";

const ADMIN_PATH = "/admin";

export const userManagementApi = {
	getCustomers: (params?: any) =>
		apiClient.get<UserListResponse<CustomerUser>>(
			`${ADMIN_PATH}/customers${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch customers",
		),

	getVendors: (params?: any) =>
		apiClient.get<UserListResponse<VendorUser>>(
			`${ADMIN_PATH}/vendors${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch vendors",
		),

	getRiders: (params?: any) =>
		apiClient.get<UserListResponse<RiderUser>>(
			`${ADMIN_PATH}/riders${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch riders",
		),

	getAdmins: (params?: any) =>
		apiClient.get<UserListResponse<AdminUser>>(
			`${ADMIN_PATH}/admins${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch admins",
		),

	getCustomerById: (id: string) =>
		apiClient.get<{ success: boolean; data: CustomerUser }>(
			`${ADMIN_PATH}/customer/${id}`,
			"Failed to fetch customer",
		),

	getVendorById: (id: string) =>
		apiClient.get<{ success: boolean; data: VendorUser }>(
			`${ADMIN_PATH}/vendor/${id}`,
			"Failed to fetch vendor",
		),

	getRiderById: (id: string) =>
		apiClient.get<{ success: boolean; data: RiderUser }>(
			`${ADMIN_PATH}/rider/${id}`,
			"Failed to fetch rider",
		),

	updateUserRole: (userId: string, newRole: string) =>
		apiClient.put<GenericResponse>(
			`${ADMIN_PATH}/update-role`,
			{ userId, newRole },
			"Failed to update user role",
		),

	updateAccountStatus: (userId: string, status: string) =>
		apiClient.put<GenericResponse>(
			`${ADMIN_PATH}/update-account-status`,
			{ userId, status },
			"Failed to update account status",
		),
};
