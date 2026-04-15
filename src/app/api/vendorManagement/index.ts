// src/app/api/vendorManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import { type VendorListResponse, type SingleVendorResponse } from "@/types/vendorManagement";

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
};

/* eslint-enable */
