// src/types/riderManagement/index.ts
import { type PaginationMeta } from "@/types/pagination";

export type RiderProfile = {
	vehicleType: "Motorbike" | "Bicycle" | "Car" | "Van";
	vehiclePlateNumber: string;
	driversLicenseImage: string;
	passportPhoto: string;
	vehicleImage: string;
	availabilityStatus: "online" | "offline" | "busy";
	verificationStatus: "pending" | "approved" | "rejected";
	isApproved: boolean;
	nin?: string;
	averageRating?: number;
	totalRatings?: number;
};

export type BankDetails = {
	bankName: string;
	accountNumber: string;
	accountName: string;
	bvn: string;
};

export type RiderUser = {
	_id: string;
	name: string;
	email: string;
	phone: string;
	role: "rider";
	profilePicture: string;
	accountStatus: "Active" | "Inactive" | "Suspend";
	riderProfile: RiderProfile;
	bankDetails?: BankDetails;
	createdAt: string;
};

export type RiderListResponse = {
	success: boolean;
	data: RiderUser[];
	pagination?: PaginationMeta;
};

// Query for GET /admin/riders. status is accountStatus, kyc is verificationStatus.
export type RiderListFilters = {
	search?: string;
	status?: "Active" | "Inactive" | "Suspend";
	kyc?: "pending" | "approved" | "rejected";
	availability?: "online" | "offline" | "busy" | "active";
	minRating?: "2" | "3" | "4";
	location?: string;
	sort?: "name_asc" | "name_desc";
	page?: number;
	limit?: number;
};

export type SingleRiderResponse = {
	success: boolean;
	data: RiderUser;
};
