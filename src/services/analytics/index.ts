// src/services/analytics/index.ts

import { apiClient } from "@/lib/apiClient";
import {
	type CustomerAnalytics,
	type VendorAnalytics,
	type RiderAnalytics,
	type VendorLeaderboardData,
	type RiderLeaderboardData,
	type DashboardOverview,
} from "@/types/analytics";

const ADMIN_ANALYTICS = "/admin/analytics";

// Query string values, e.g. { range: "monthly" }; undefined values are left out
export type AnalyticsParams = Record<string, string | undefined>;

const toQuery = (params?: AnalyticsParams) => {
	const entries = Object.entries(params ?? {}).filter(
		(entry): entry is [string, string] => entry[1] !== undefined,
	);
	return entries.length ? `?${new URLSearchParams(entries).toString()}` : "";
};

export const analyticsApi = {
	getCustomerAnalytics: (params?: AnalyticsParams) =>
		apiClient.get<{ success: boolean; data: CustomerAnalytics }>(
			`${ADMIN_ANALYTICS}/customer${toQuery(params)}`,
			"Failed to fetch customer analytics",
		),

	getVendorAnalytics: (params?: AnalyticsParams) =>
		apiClient.get<{ success: boolean; data: VendorAnalytics }>(
			`${ADMIN_ANALYTICS}/vendor${toQuery(params)}`,
			"Failed to fetch vendor analytics",
		),

	getVendorLeaderboard: (params: AnalyticsParams = { range: "monthly" }) =>
		apiClient.get<{ success: boolean; data: VendorLeaderboardData[] }>(
			`${ADMIN_ANALYTICS}/vendor-leaderboard${toQuery(params)}`,
			"Failed to fetch vendor leaderboard",
		),

	getRiderAnalytics: (params?: AnalyticsParams) =>
		apiClient.get<{ success: boolean; data: RiderAnalytics }>(
			`${ADMIN_ANALYTICS}/rider${toQuery(params)}`,
			"Failed to fetch rider analytics",
		),

	getRiderLeaderboard: (params?: AnalyticsParams) =>
		apiClient.get<{ success: boolean; data: RiderLeaderboardData[] }>(
			`${ADMIN_ANALYTICS}/rider-leaderboard${toQuery(params)}`,
			"Failed to fetch rider leaderboard",
		),

	getDashboardOverview: () =>
		apiClient.get<{ success: boolean; data: DashboardOverview }>(
			`${ADMIN_ANALYTICS}/dashboard-overview`,
			"Failed to fetch dashboard overview",
		),
};
