// src/hooks/vendorManagement/index.ts
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { vendorApi } from "@/app/api/vendorManagement";
import { type VendorListFilters } from "@/types/vendorManagement";

// The one vendor list hook. Every vendor list shares the ["vendors", ...] cache,
// so a status change invalidates all of them. Single vendors: useVendor in
// hooks/userManagement.
export const useVendors = (
	filters: VendorListFilters = {},
	options: { enabled?: boolean; keepPrevious?: boolean } = {},
) => {
	return useQuery({
		queryKey: ["vendors", filters],
		queryFn: () => vendorApi.getAllVendors(filters),
		enabled: options.enabled ?? true,
		placeholderData: options.keepPrevious ? keepPreviousData : undefined,
	});
};

export const useUpdateVendorStatus = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		// FIX: Pass one object to the API function
		mutationFn: ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" }) =>
			vendorApi.updateVendorStatus({ vendorId: id, status }),

		onSuccess: (data) => {
			toast.success(data.message);
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
			queryClient.invalidateQueries({ queryKey: ["vendor"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useVendorCategories = () => {
	return useQuery({
		queryKey: ["vendorCategories"],
		queryFn: vendorApi.getVendorCategories,
	});
};

export const useVendorMenuDetails = (id: string) => {
	return useQuery({
		queryKey: ["vendorMenu", id],
		queryFn: () => vendorApi.getVendorMenuDetails(id),
		enabled: !!id,
	});
};

export const useVendorStaff = (id: string) => {
	return useQuery({
		queryKey: ["vendorStaff", id],
		queryFn: () => vendorApi.getVendorStaff(id),
		enabled: !!id,
	});
};

export const useCreateVendorStaff = (vendorId: string) => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: {
			name: string;
			role: string;
			email: string;
			phone?: string;
			profilePicture?: string;
			permissions?: string[];
		}) => vendorApi.createVendorStaff(vendorId, payload),
		onSuccess: (data) => {
			toast.success(data.message || "Staff member added");
			queryClient.invalidateQueries({ queryKey: ["vendorStaff", vendorId] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useUpdateVendorStaff = (vendorId: string) => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({
			staffId,
			payload,
		}: {
			staffId: string;
			payload: {
				name?: string;
				role?: string;
				email?: string;
				phone?: string;
				status?: "Active" | "Inactive";
				profilePicture?: string;
				permissions?: string[];
			};
		}) => vendorApi.updateVendorStaff(vendorId, staffId, payload),
		onSuccess: (data) => {
			toast.success(data.message || "Staff member updated");
			queryClient.invalidateQueries({ queryKey: ["vendorStaff", vendorId] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useDeleteVendorStaff = (vendorId: string) => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (staffId: string) => vendorApi.deleteVendorStaff(vendorId, staffId),
		onSuccess: (data) => {
			toast.success(data.message || "Staff member removed");
			queryClient.invalidateQueries({ queryKey: ["vendorStaff", vendorId] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

/* eslint-enable */
