// src/app/api/vendorManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import {
	type VendorListResponse,
	type VendorListFilters,
	type VendorCategoriesResponse,
	type VendorMenuDetailsResponse,
	type VendorStaffMember,
} from "@/types/vendorManagement";

const ADMIN_BASE = "/admin";

const toQuery = (filters: Record<string, string | number | undefined>) => {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== "" && value !== "all")
			params.append(key, String(value));
	});
	const query = params.toString();
	return query ? `?${query}` : "";
};

export const vendorApi = {
	getAllVendors: (filters: VendorListFilters = {}) =>
		apiClient.get<VendorListResponse>(
			`${ADMIN_BASE}/vendors${toQuery(filters)}`,
			"Failed to fetch vendors",
		),

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
		apiClient.get<VendorCategoriesResponse>(
			"/vendor-categories",
			"Failed to fetch vendor categories",
		),

	getVendorMenuDetails: (id: string) =>
		apiClient.get<VendorMenuDetailsResponse>(
			`${ADMIN_BASE}/vendor/${id}/menu`,
			"Failed to fetch vendor menu details",
		),

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
