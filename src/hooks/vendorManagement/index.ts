// src/hooks/vendorManagement/index.ts
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { vendorApi } from "@/app/api/vendorManagement";

export const useVendors = () => {
	return useQuery({
		queryKey: ["vendors"],
		queryFn: vendorApi.getAllVendors,
	});
};

export const useSingleVendor = (id: string) => {
	return useQuery({
		queryKey: ["vendor", id],
		queryFn: () => vendorApi.getVendorById(id),
		enabled: !!id,
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
