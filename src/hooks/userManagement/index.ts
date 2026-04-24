import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userManagementApi } from "@/app/api/userManagement";
import { useToast } from "@/hooks/useToast";
import { RegisterStaffRequest } from "@/types/userManagement";

export const useCustomers = (params?: any) => {
	return useQuery({
		queryKey: ["customers", params],
		queryFn: () => userManagementApi.getCustomers(params),
	});
};

export const useVendors = (params?: any) => {
	return useQuery({
		queryKey: ["vendors", params],
		queryFn: () => userManagementApi.getVendors(params),
	});
};

export const useRiders = (params?: any) => {
	return useQuery({
		queryKey: ["riders", params],
		queryFn: () => userManagementApi.getRiders(params),
	});
};

export const useCustomer = (id: string, enabled = true) => {
	return useQuery({
		queryKey: ["customer", id],
		queryFn: () => userManagementApi.getCustomerById(id),
		enabled: !!id && enabled,
	});
};

export const useVendor = (id: string, enabled = true) => {
	return useQuery({
		queryKey: ["vendor", id],
		queryFn: () => userManagementApi.getVendorById(id),
		enabled: !!id && enabled,
	});
};

export const useRider = (id: string, enabled = true) => {
	return useQuery({
		queryKey: ["rider", id],
		queryFn: () => userManagementApi.getRiderById(id),
		enabled: !!id && enabled,
	});
};

export const useAdmins = (params?: any) => {
	return useQuery({
		queryKey: ["admins", params],
		queryFn: () => userManagementApi.getAdmins(params),
	});
};

export const useUpdateUserRole = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, newRole }: { userId: string; newRole: string }) =>
			userManagementApi.updateUserRole(userId, newRole),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["customers"] });
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
			queryClient.invalidateQueries({ queryKey: ["riders"] });
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			// Also invalidate individual user queries
			queryClient.invalidateQueries({ queryKey: ["customer"] });
			queryClient.invalidateQueries({ queryKey: ["vendor"] });
			queryClient.invalidateQueries({ queryKey: ["rider"] });
		},
	});
};

export const useUpdateAccountStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, status }: { userId: string; status: string }) =>
			userManagementApi.updateAccountStatus(userId, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["customers"] });
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
			queryClient.invalidateQueries({ queryKey: ["riders"] });
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			// Also invalidate individual user queries
			queryClient.invalidateQueries({ queryKey: ["customer"] });
			queryClient.invalidateQueries({ queryKey: ["vendor"] });
			queryClient.invalidateQueries({ queryKey: ["rider"] });
		},
	});
};

export const useInviteStaff = () => {
	const toast = useToast();
	return useMutation({
		mutationFn: userManagementApi.inviteStaff,
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.message || "Invitation sent successfully");
			}
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useUpgradeStaffToSuperAdmin = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: (userId: string) => userManagementApi.upgradeStaffToSuperAdmin(userId),
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.message || "User upgraded to SuperAdmin");
				queryClient.invalidateQueries({ queryKey: ["admins"] });
			}
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};
import { AdminProfileUpdate, ChangePasswordRequest } from "@/types/userManagement";

export const useAdminProfile = () => {
	return useQuery({
		queryKey: ["admin-profile"],
		queryFn: () => userManagementApi.getAdminProfile(),
	});
};

export const useUpdateAdminProfile = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: (data: AdminProfileUpdate) => userManagementApi.updateAdminProfile(data),
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.message || "Profile updated successfully");
				queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
			}
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useChangePassword = () => {
	const toast = useToast();
	return useMutation({
		mutationFn: (data: ChangePasswordRequest) => userManagementApi.changePassword(data),
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.message || "Password changed successfully");
			}
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

/* --- Invitations Hooks --- */

export const useInvitations = () => {
	return useQuery({
		queryKey: ["invitations"],
		queryFn: () => userManagementApi.getInvitations(),
	});
};

export const useResendInvitation = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (email: string) => userManagementApi.resendInvitation(email),
		onSuccess: () => {
			toast.success("Invitation resent successfully");
			queryClient.invalidateQueries({ queryKey: ["invitations"] });
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to resend invitation");
		},
	});
};

export const useCancelInvitation = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (email: string) => userManagementApi.cancelInvitation(email),
		onSuccess: () => {
			toast.success("Invitation cancelled successfully");
			queryClient.invalidateQueries({ queryKey: ["invitations"] });
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to cancel invitation");
		},
	});
};

export const useRegisterStaff = () => {
	const router = useRouter();
	const toast = useToast();

	return useMutation({
		mutationFn: (data: RegisterStaffRequest) => userManagementApi.registerStaff(data),
		onSuccess: () => {
			toast.success("Registration successful! You can now log in.");
			router.push("/login");
		},
		onError: (error: any) => {
			toast.error(error.message || "Registration failed. Please try again.");
		},
	});
};

export const useDeleteAdmin = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => userManagementApi.deleteAdmin(id),
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.message || "Admin account deleted successfully");
				queryClient.invalidateQueries({ queryKey: ["admins"] });
			}
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to delete admin account");
		},
	});
};
