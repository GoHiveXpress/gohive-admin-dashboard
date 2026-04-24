// src/hooks/useVendorCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorCategoryApi } from "@/app/api/vendorCategories";
import { useToast } from "@/hooks/useToast";

export const useVendorCategories = () => {
	return useQuery({
		queryKey: ["vendor-categories"],
		queryFn: () => vendorCategoryApi.getAllCategories(),
	});
};

export const useCreateVendorCategory = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (formData: FormData) => vendorCategoryApi.createCategory(formData),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("Category created successfully");
				queryClient.invalidateQueries({ queryKey: ["vendor-categories"] });
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create category");
		},
	});
};

export const useVendorCategory = (id: string) => {
	return useQuery({
		queryKey: ["vendor-category", id],
		queryFn: () => vendorCategoryApi.getCategoryById(id),
		enabled: !!id,
	});
};

export const useUpdateVendorCategory = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, formData }: { id: string; formData: FormData }) => vendorCategoryApi.updateCategory({ id, formData }),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("Category updated successfully");
				queryClient.invalidateQueries({ queryKey: ["vendor-categories"] });
				queryClient.invalidateQueries({ queryKey: ["vendor-category", data.data._id] });
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to update category");
		},
	});
};

export const useDeleteVendorCategory = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => vendorCategoryApi.deleteCategory(id),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("Category deleted successfully");
				queryClient.invalidateQueries({ queryKey: ["vendor-categories"] });
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to delete category");
		},
	});
};
