// src/services/accountTools.ts
import { apiClient } from "@/lib/apiClient";
import axiosInstance from "@/lib/axiosInstance";
import handleApiError from "@/utils/handleApiError";
import {
	type ActionResponse,
	type AdminNote,
	type AdminNotesResponse,
	type AdminSessionsResponse,
	type CustomerWalletResponse,
	type SignOutOthersResponse,
	type VendorClosure,
	type VendorHoursResponse,
} from "@/types/accountTools";
import { type OperatingHours } from "@/types/vendorManagement";

const ADMIN_BASE = "/admin";

// eslint-disable-next-line import/prefer-default-export
export const accountToolsApi = {
	// --- Customers ---
	signOutCustomer: (id: string) =>
		apiClient.post<ActionResponse, Record<string, never>>(
			`${ADMIN_BASE}/customer/${id}/sign-out`,
			{},
			"Failed to sign the customer out",
		),

	resetCustomerPassword: (id: string) =>
		apiClient.post<ActionResponse, Record<string, never>>(
			`${ADMIN_BASE}/customer/${id}/reset-password`,
			{},
			"Failed to reset the password",
		),

	getCustomerWallet: (id: string, page: number) =>
		apiClient.get<CustomerWalletResponse>(
			`${ADMIN_BASE}/customer/${id}/wallet?page=${page}&limit=20`,
			"Failed to fetch the wallet",
		),

	getCustomerNotes: (id: string) =>
		apiClient.get<AdminNotesResponse>(
			`${ADMIN_BASE}/customer/${id}/notes`,
			"Failed to fetch notes",
		),

	addCustomerNote: (id: string, text: string) =>
		apiClient.post<{ success: boolean; message: string; data: AdminNote }, { text: string }>(
			`${ADMIN_BASE}/customer/${id}/notes`,
			{ text },
			"Failed to add the note",
		),

	// The backend answers with a JSON attachment; hand it back as a file
	exportCustomerData: async (id: string) => {
		try {
			const response = await axiosInstance.get<Blob>(`${ADMIN_BASE}/customer/${id}/export`, {
				responseType: "blob",
			});
			return response.data;
		} catch (err) {
			return handleApiError(err, "Failed to export the customer's data");
		}
	},

	deleteCustomer: (id: string, reason: string) =>
		apiClient.post<ActionResponse, { reason: string }>(
			`${ADMIN_BASE}/customer/${id}/delete`,
			{ reason },
			"Failed to delete the customer",
		),

	// --- Vendors ---
	closeVendor: (id: string, payload: { reason: string; hours?: number }) =>
		apiClient.post<
			{ success: boolean; message: string; data: VendorClosure },
			{ reason: string; hours?: number }
		>(`${ADMIN_BASE}/vendor/${id}/close`, payload, "Failed to close the store"),

	reopenVendor: (id: string) =>
		apiClient.post<ActionResponse, Record<string, never>>(
			`${ADMIN_BASE}/vendor/${id}/reopen`,
			{},
			"Failed to reopen the store",
		),

	updateVendorHours: (id: string, operatingHours: OperatingHours[]) =>
		apiClient.put<VendorHoursResponse, { operatingHours: OperatingHours[] }>(
			`${ADMIN_BASE}/vendor/${id}/hours`,
			{ operatingHours },
			"Failed to save opening hours",
		),

	updateVendorCommission: (id: string, commissionPercent: number) =>
		apiClient.put<ActionResponse, { commissionPercent: number }>(
			`${ADMIN_BASE}/vendor/${id}/commission`,
			{ commissionPercent },
			"Failed to save the commission",
		),

	setMenuItemVisibility: (
		vendorId: string,
		itemId: string,
		payload: { hidden: boolean; reason?: string },
	) =>
		apiClient.put<ActionResponse, { hidden: boolean; reason?: string }>(
			`${ADMIN_BASE}/vendor/${vendorId}/menu/${itemId}/visibility`,
			payload,
			"Failed to change the item",
		),

	// --- Admin sessions ---
	getMySessions: () =>
		apiClient.get<AdminSessionsResponse>(`${ADMIN_BASE}/sessions`, "Failed to fetch sessions"),

	revokeMySession: (id: string) =>
		apiClient.post<ActionResponse, Record<string, never>>(
			`${ADMIN_BASE}/sessions/${id}/revoke`,
			{},
			"Failed to sign out that device",
		),

	signOutOtherSessions: () =>
		apiClient.post<SignOutOthersResponse, Record<string, never>>(
			`${ADMIN_BASE}/sessions/sign-out-others`,
			{},
			"Failed to sign out other devices",
		),

	getAdminSessions: (adminId: string) =>
		apiClient.get<AdminSessionsResponse>(
			`${ADMIN_BASE}/admin/${adminId}/sessions`,
			"Failed to fetch that admin's sessions",
		),

	signOutAdminEverywhere: (adminId: string) =>
		apiClient.post<ActionResponse, Record<string, never>>(
			`${ADMIN_BASE}/admin/${adminId}/sign-out-everywhere`,
			{},
			"Failed to sign that admin out",
		),
};
