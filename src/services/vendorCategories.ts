// src/services/vendorCategories.ts
/* eslint-disable import/prefer-default-export */
import axiosInstance from "@/lib/axiosInstance";
import { type IVendorCategory } from "@/types/vendorManagement/vendorCategory";

export const vendorCategoryApi = {
	getAllCategories: async (): Promise<{ success: boolean; data: IVendorCategory[] }> => {
		const response = await axiosInstance.get<{ success: boolean; data: IVendorCategory[] }>(
			"/vendor-categories",
		);
		return response.data;
	},

	createCategory: async (
		formData: FormData,
	): Promise<{ success: boolean; message: string; data: IVendorCategory }> => {
		const response = await axiosInstance.post<{
			success: boolean;
			message: string;
			data: IVendorCategory;
		}>("/vendor-categories/create", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	getCategoryById: async (id: string): Promise<{ success: boolean; data: IVendorCategory }> => {
		const response = await axiosInstance.get<{ success: boolean; data: IVendorCategory }>(
			`/vendor-categories/${id}`,
		);
		return response.data;
	},

	updateCategory: async ({
		id,
		formData,
	}: {
		id: string;
		formData: FormData;
	}): Promise<{ success: boolean; message: string; data: IVendorCategory }> => {
		const response = await axiosInstance.put<{
			success: boolean;
			message: string;
			data: IVendorCategory;
		}>(`/vendor-categories/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
		const response = await axiosInstance.delete<{ success: boolean; message: string }>(
			`/vendor-categories/${id}`,
		);
		return response.data;
	},
};

/* eslint-enable */
