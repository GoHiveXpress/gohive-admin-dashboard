// src/app/api/riderManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import { type RiderListResponse, type SingleRiderResponse } from "@/types/riderManagement";

const ADMIN_BASE = "/admin";

export const riderApi = {
	getAllRiders: () =>
		apiClient.get<RiderListResponse>(`${ADMIN_BASE}/riders`, "Failed to fetch riders"),

	getRiderById: (id: string) =>
		apiClient.get<SingleRiderResponse>(`${ADMIN_BASE}/rider/${id}`, "Failed to fetch rider"),

	updateRiderStatus: (params: { riderId: string; status: "pending" | "approved" | "rejected" }) =>
		apiClient.put<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/update-rider-status`,
			params,
			"Failed to update rider status",
		),
};

/* eslint-enable */
