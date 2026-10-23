// src/app/api/riderManagement/index.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import { type RiderListFilters, type RiderListResponse } from "@/types/riderManagement";

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

export const riderApi = {
	getAllRiders: (filters: RiderListFilters = {}) =>
		apiClient.get<RiderListResponse>(
			`${ADMIN_BASE}/riders${toQuery(filters)}`,
			"Failed to fetch riders",
		),

	updateRiderStatus: (params: { riderId: string; status: "pending" | "approved" | "rejected" }) =>
		apiClient.put<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/update-rider-status`,
			params,
			"Failed to update rider status",
		),

	getRiderTrips: (id: string, params?: { status?: string; month?: number; year?: number }) => {
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
