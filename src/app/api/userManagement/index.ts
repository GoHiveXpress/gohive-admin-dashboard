// src/app/api/userManagement/index.ts
import { apiClient } from "@/lib/apiClient";
import {
	CustomerUser,
	VendorUser,
	RiderUser,
	AdminUser,
	UserListResponse,
	GenericResponse,
	InviteStaffRequest,
	Invitation,
	ChangePasswordRequest,
	AdminProfileUpdate,
	RegisterStaffRequest,
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

	inviteStaff: (data: InviteStaffRequest) =>
		apiClient.post<GenericResponse>(`${ADMIN_PATH}/invite-staff`, data, "Failed to invite staff"),

	upgradeStaffToSuperAdmin: (userId: string) =>
		apiClient.put<GenericResponse>(
			`${ADMIN_PATH}/upgrade-staff`,
			{ userId },
			"Failed to upgrade staff role",
		),

	getAdminProfile: () =>
		apiClient.get<{ success: boolean; data: AdminUser }>(
			`${ADMIN_PATH}/profile`,
			"Failed to fetch admin profile",
		),

	updateAdminProfile: (data: AdminProfileUpdate) =>
		apiClient.put<GenericResponse>(
			`${ADMIN_PATH}/profile/update`,
			data,
			"Failed to update admin profile",
		),

	changePassword: (data: ChangePasswordRequest) =>
		apiClient.post<GenericResponse>("/auth/update-password", data, "Failed to change password"),

	getInvitations: () =>
		apiClient.get<{ success: boolean; data: Invitation[] }>(
			`${ADMIN_PATH}/invitations`,
			"Failed to fetch invitations",
		),

	resendInvitation: (email: string) =>
		apiClient.post<GenericResponse>(
			`${ADMIN_PATH}/resend-invitation`,
			{ email },
			"Failed to resend invitation",
		),

	cancelInvitation: (email: string) =>
		apiClient.post<GenericResponse>(
			`${ADMIN_PATH}/cancel-invitation`,
			{ email },
			"Failed to cancel invitation",
		),

	registerStaff: (data: RegisterStaffRequest) =>
		apiClient.post<GenericResponse>(
			"/auth/register-staff",
			data,
			"Failed to register staff",
		),
	getAdminPermissions: (id: string) =>
		apiClient.get<{
			success: boolean;
			data: {
				_id: string;
				name: string;
				role: "superadmin" | "staff";
				accountStatus: "Active" | "Inactive" | "Suspend";
				permissions: string[];
			};
		}>(`${ADMIN_PATH}/admin/${id}/permissions`, "Failed to fetch admin permissions"),

	updateAdminPermissions: (
		id: string,
		data: {
			permissions?: string[];
			role?: "superadmin" | "staff";
			accountStatus?: "Active" | "Inactive" | "Suspend";
		},
	) =>
		apiClient.put<GenericResponse>(
			`${ADMIN_PATH}/admin/${id}/permissions`,
			data,
			"Failed to update admin permissions",
		),
	deleteAdmin: (id: string) =>
		apiClient.delete<GenericResponse>(`${ADMIN_PATH}/admin/${id}`, "Failed to delete admin account"),
};
