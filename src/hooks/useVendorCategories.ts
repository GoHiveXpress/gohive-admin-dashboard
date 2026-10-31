// src/hooks/useVendorCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { vendorCategoryApi } from "@/services/vendorCategories";
import { useToast } from "@/hooks/useToast";

const apiMessage = (error: Error) =>
	isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;

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
		onSuccess: async (data) => {
			if (data.success) {
				toast.success("Category created successfully");
				await queryClient.invalidateQueries({ queryKey: ["vendor-categories"] });
			}
		},
		onError: (error: Error) => {
			toast.error(apiMessage(error) ?? "Failed to create category");
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
		mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
			vendorCategoryApi.updateCategory({ id, formData }),
		onSuccess: async (data) => {
			if (data.success) {
				toast.success("Category updated successfully");
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: ["vendor-categories"] }),
					queryClient.invalidateQueries({ queryKey: ["vendor-category", data.data._id] }),
				]);
			}
		},
		onError: (error: Error) => {
			toast.error(apiMessage(error) ?? "Failed to update category");
		},
	});
};

export const useDeleteVendorCategory = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => vendorCategoryApi.deleteCategory(id),
		onSuccess: async (data) => {
			if (data.success) {
				toast.success("Category deleted successfully");
				await queryClient.invalidateQueries({ queryKey: ["vendor-categories"] });
			}
		},
		onError: (error: Error) => {
			toast.error(apiMessage(error) ?? "Failed to delete category");
		},
	});
};
