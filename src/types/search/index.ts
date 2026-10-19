// src/types/search/index.ts

export type SearchGroup = "orders" | "customers" | "vendors" | "riders";

export interface SearchOrder {
	_id: string;
	orderId: string;
	status: string;
	totalAmount: number;
	paymentStatus?: string;
	createdAt: string;
	customer?: { _id: string; name: string } | null;
	vendor?: { _id: string; name: string; vendorProfile?: { businessName?: string } } | null;
}

export interface SearchUser {
	_id: string;
	name: string;
	email?: string;
	phone?: string;
	role: "customer" | "vendor" | "rider";
	accountStatus?: string;
	vendorProfile?: { businessName?: string; vendorId?: string };
}

// Only the groups the admin is allowed to see are present.
export interface GlobalSearchResponse {
	success: boolean;
	query: string;
	data: {
		orders?: SearchOrder[];
		customers?: SearchUser[];
		vendors?: SearchUser[];
		riders?: SearchUser[];
	};
}
