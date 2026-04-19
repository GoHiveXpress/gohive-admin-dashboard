// src/hooks/analytics/index.ts
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/app/api/analytics";

export const useCustomerAnalytics = (params?: any) => {
	return useQuery({
		queryKey: ["customerAnalytics", params],
		queryFn: () => analyticsApi.getCustomerAnalytics(params),
	});
};

export const useVendorAnalytics = (params?: any) => {
	return useQuery({
		queryKey: ["vendorAnalytics", params],
		queryFn: () => analyticsApi.getVendorAnalytics(params),
	});
};

export const useVendorLeaderboard = (params: any = { range: "all_time" }) => {
	return useQuery({
		queryKey: ["vendorLeaderboard", params],
		queryFn: () => analyticsApi.getVendorLeaderboard(params),
	});
};

export const useRiderAnalytics = (params?: any) => {
	return useQuery({
		queryKey: ["riderAnalytics", params],
		queryFn: () => analyticsApi.getRiderAnalytics(params),
	});
};

export const useRiderLeaderboard = (params?: any) => {
	return useQuery({
		queryKey: ["riderLeaderboard", params],
		queryFn: () => analyticsApi.getRiderLeaderboard(params),
	});
};

export const useDashboardOverview = () => {
	return useQuery({
		queryKey: ["dashboardOverview"],
		queryFn: () => analyticsApi.getDashboardOverview(),
	});
};
