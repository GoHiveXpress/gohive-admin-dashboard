// src/types/analytics/index.ts

export type VolumeBucket = {
	name: string | number;
	[key: string]: string | number;
};

export interface DashboardOverview {
	customers: {
		total: number;
		comparison: number;
	};
	riders: {
		total: number;
		online: number;
	};
	vendors: {
		total: number;
		online: number;
	};
	orders: {
		total: number;
		comparison: number;
	};
	today: {
		total: number;
		[key: string]: number;
	};
	activeOrders?: any[];
}

export interface LeaderboardParams {
	range?: string;
	start_date?: string;
	end_date?: string;
	location?: string;
	category?: string;
	sort?: string;
};

export type RetentionBucket = {
	name: string;
	value: number;
};

export type CustomerAnalytics = {
	metrics: {
		churnRate: string | number;
		returnRate: string | number;
		repeatOrderRate: string | number;
	};
	volumeData: VolumeBucket[];
	retentionData: RetentionBucket[];
	comparison?: {
		churnRate: string;
		returnRate: string;
		repeatOrderRate: string;
	};
};

export type VendorAnalytics = {
	metrics: {
		avgPrepTime: number;
		completionRate: string | number;
		cancellationRate: string | number;
		customerRating: string | number;
	};
	comparison?: {
		avgPrepTime: number;
		completionRate: string;
		cancellationRate: string;
		customerRating: string;
	};
};

export type RiderAnalytics = {
	metrics: {
		avgDeliveryTime: number;
		acceptanceRate: number;
		completionRate: string | number;
		onTimeDeliveries: number;
	};
	comparison?: {
		avgDeliveryTime: number;
		acceptanceRate: number;
		completionRate: string;
		onTimeDeliveries: number;
	};
};

export type VendorLeaderboardData = {
	id: string;
	rank: number;
	vendorName: string;
	location: string;
	category: string;
	totalOrders: number;
	avgRating: number;
	deliveryTime: string;
	revenue: string;
	trend: "Improving" | "Stable" | "Declining";
};

export type RiderLeaderboardData = {
	id: string;
	rank: number;
	riderName: string;
	riderId: string;
	location: string;
	compositeScore: string | number;
	tripCount: number;
	avgRating: number;
	estDeliveryTime: string;
	totalEarnings: string;
	trend: "Improving" | "Stable" | "Declining";
};
