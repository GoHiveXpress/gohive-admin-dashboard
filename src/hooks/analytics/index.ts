// src/hooks/analytics/index.ts
import { useQuery } from "@tanstack/react-query";
import { type AnalyticsParams, analyticsApi } from "@/services/analytics";

export const useCustomerAnalytics = (params?: AnalyticsParams) => {
	return useQuery({
		queryKey: ["customerAnalytics", params],
		queryFn: () => analyticsApi.getCustomerAnalytics(params),
	});
};

export const useVendorAnalytics = (params?: AnalyticsParams) => {
	return useQuery({
		queryKey: ["vendorAnalytics", params],
		queryFn: () => analyticsApi.getVendorAnalytics(params),
	});
};

export const useVendorLeaderboard = (
	params: AnalyticsParams = { range: "all_time" },
	enabled = true,
) => {
	return useQuery({
		queryKey: ["vendorLeaderboard", params],
		queryFn: () => analyticsApi.getVendorLeaderboard(params),
		enabled,
	});
};

export const useRiderAnalytics = (params?: AnalyticsParams) => {
	return useQuery({
		queryKey: ["riderAnalytics", params],
		queryFn: () => analyticsApi.getRiderAnalytics(params),
	});
};

export const useRiderLeaderboard = (params?: AnalyticsParams) => {
	return useQuery({
		queryKey: ["riderLeaderboard", params],
		queryFn: () => analyticsApi.getRiderLeaderboard(params),
	});
};

export const useDashboardOverview = (enabled = true) => {
	return useQuery({
		queryKey: ["dashboardOverview"],
		queryFn: () => analyticsApi.getDashboardOverview(),
		enabled,
	});
};
