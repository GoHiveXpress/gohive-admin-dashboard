// src/app/api/vendorManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type VendorListResponse,
	type SingleVendorResponse,
	type VendorCategoriesResponse,
	type VendorMenuDetailsResponse,
	type VendorStaffMember,
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

	getVendorStaff: (id: string) =>
		apiClient.get<{ success: boolean; data: VendorStaffMember[] }>(
			`${ADMIN_BASE}/vendor/${id}/staff`,
			"Failed to fetch vendor staff",
		),

	createVendorStaff: (
		id: string,
		payload: {
			name: string;
			role: string;
			email: string;
			phone?: string;
			profilePicture?: string;
			permissions?: string[];
		},
	) =>
		apiClient.post<{ success: boolean; message: string; data: VendorStaffMember }>(
			`${ADMIN_BASE}/vendor/${id}/staff`,
			payload,
			"Failed to add vendor staff",
		),

	updateVendorStaff: (
		id: string,
		staffId: string,
		payload: {
			name?: string;
			role?: string;
			email?: string;
			phone?: string;
			status?: "Active" | "Inactive";
			profilePicture?: string;
			permissions?: string[];
		},
	) =>
		apiClient.put<{ success: boolean; message: string; data: VendorStaffMember }>(
			`${ADMIN_BASE}/vendor/${id}/staff/${staffId}`,
			payload,
			"Failed to update vendor staff",
		),

	deleteVendorStaff: (id: string, staffId: string) =>
		apiClient.delete<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/vendor/${id}/staff/${staffId}`,
			"Failed to remove vendor staff",
		),
};

/* eslint-enable */
