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

/* eslint-enable */
