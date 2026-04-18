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

	getRiderTrips: (id: string, params?: { status?: string, month?: number, year?: number }) => {
		const searchParams = new URLSearchParams();
		if (params?.status) searchParams.append("status", params.status);
		if (params?.month !== undefined) searchParams.append("month", params.month.toString());
		if (params?.year !== undefined) searchParams.append("year", params.year.toString());

		return apiClient.get<{ success: boolean; data: { date: string; trips: number }[] }>(
			`${ADMIN_BASE}/rider/${id}/trips?${searchParams.toString()}`,
			"Failed to fetch rider trips",
		);
	},
};

/* eslint-enable */
