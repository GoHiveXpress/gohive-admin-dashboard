// src/hooks/userManagement/index.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userManagementApi } from "@/app/api/userManagement";

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
