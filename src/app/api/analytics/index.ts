// src/app/api/analytics/index.ts
import { apiClient } from "@/lib/apiClient";
import {
	CustomerAnalytics,
	VendorAnalytics,
	RiderAnalytics,
	VendorLeaderboardData,
	RiderLeaderboardData,
	DashboardOverview,
} from "@/types/analytics";

const ADMIN_ANALYTICS = "/admin/analytics";

export const analyticsApi = {
	getCustomerAnalytics: (params?: any) =>
		apiClient.get<{ success: boolean; data: CustomerAnalytics }>(
			`${ADMIN_ANALYTICS}/customer${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch customer analytics",
		),

	getVendorAnalytics: (params?: any) =>
		apiClient.get<{ success: boolean; data: VendorAnalytics }>(
			`${ADMIN_ANALYTICS}/vendor${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch vendor analytics",
		),

	getVendorLeaderboard: (params: any = { range: "monthly" }) =>
		apiClient.get<{ success: boolean; data: VendorLeaderboardData[] }>(
			`${ADMIN_ANALYTICS}/vendor-leaderboard${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch vendor leaderboard",
		),

	getRiderAnalytics: (params?: any) =>
		apiClient.get<{ success: boolean; data: RiderAnalytics }>(
			`${ADMIN_ANALYTICS}/rider${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch rider analytics",
		),

	getRiderLeaderboard: (params?: any) =>
		apiClient.get<{ success: boolean; data: RiderLeaderboardData[] }>(
			`${ADMIN_ANALYTICS}/rider-leaderboard${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
			"Failed to fetch rider leaderboard",
		),

	getDashboardOverview: () =>
		apiClient.get<{ success: boolean; data: DashboardOverview }>(
			`${ADMIN_ANALYTICS}/dashboard-overview`,
			"Failed to fetch dashboard overview",
		),
};
