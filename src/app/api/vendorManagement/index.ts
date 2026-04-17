// src/app/api/vendorManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type VendorListResponse,
	type SingleVendorResponse,
	type VendorCategoriesResponse,
	type VendorMenuDetailsResponse,
} from "@/types/vendorManagement";

const ADMIN_BASE = "/admin";

export const vendorApi = {
	getAllVendors: () =>
		apiClient.get<VendorListResponse>(`${ADMIN_BASE}/vendors`, "Failed to fetch vendors"),

	getVendorById: (id: string) =>
		apiClient.get<SingleVendorResponse>(`${ADMIN_BASE}/vendor/${id}`, "Failed to fetch vendor"),

	updateVendorStatus: (params: {
		vendorId: string;
		status: "pending" | "approved" | "rejected";
	}) =>
		apiClient.put<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/update-vendor-status`,
			params, // Pass the whole object directly
			"Failed to update vendor status",
		),

	getVendorCategories: () =>
		apiClient.get<VendorCategoriesResponse>("/vendor-categories", "Failed to fetch vendor categories"),

	getVendorMenuDetails: (id: string) =>
		apiClient.get<VendorMenuDetailsResponse>(`${ADMIN_BASE}/vendor/${id}/menu`, "Failed to fetch vendor menu details"),
};

/* eslint-enable */
