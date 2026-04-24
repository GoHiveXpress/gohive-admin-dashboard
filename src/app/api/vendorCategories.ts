// src/app/api/vendorCategories.ts
import axiosInstance from "@/lib/axiosInstance";
import { IVendorCategory } from "@/types/vendorManagement/vendorCategory";

export const vendorCategoryApi = {
	getAllCategories: async (): Promise<{ success: boolean; data: IVendorCategory[] }> => {
		const response = await axiosInstance.get("/vendor-categories");
		return response.data;
	},

	createCategory: async (formData: FormData): Promise<{ success: boolean; message: string; data: IVendorCategory }> => {
		const response = await axiosInstance.post("/vendor-categories/create", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	getCategoryById: async (id: string): Promise<{ success: boolean; data: IVendorCategory }> => {
		const response = await axiosInstance.get(`/vendor-categories/${id}`);
		return response.data;
	},

	updateCategory: async ({ id, formData }: { id: string; formData: FormData }): Promise<{ success: boolean; message: string; data: IVendorCategory }> => {
		const response = await axiosInstance.put(`/vendor-categories/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
		const response = await axiosInstance.delete(`/vendor-categories/${id}`);
		return response.data;
	},
};
