// src/types/vendorManagement/index.ts
export type OperatingHours = {
	day: string;
	openTime: string;
	closeTime: string;
	is24Hours: boolean;
	isOpen: boolean;
};

export type VendorProfile = {
	businessName: string;
	businessType: string;
	businessAddress: string;
	businessBanner?: string;
	cacNumber: string;
	govtIdImage: string;
	passportPhoto: string;
	operatingHours: OperatingHours[];
	verificationStatus: "pending" | "approved" | "rejected";
	availabilityStatus?: "online" | "offline";
	isApproved: boolean;
};

export type BankDetails = {
	bankName: string;
	accountNumber: string;
	accountName: string;
	bvn: string;
};

export type VendorUser = {
	_id: string;
	name: string;
	email: string;
	phone: string;
	role: "vendor";
	profilePicture: string;
	vendorProfile: VendorProfile;
	bankDetails?: BankDetails;
	createdAt: string;
};

export type VendorListResponse = {
	success: boolean;
	data: VendorUser[];
};

export type SingleVendorResponse = {
	success: boolean;
	data: VendorUser;
};

export type GlobalVendorCategory = {
	_id: string;
	title: string;
	subtitle: string;
	value: string;
	backgroundColor: string;
	imageUrl: string;
	isActive: boolean;
	createdAt: string;
};

export type VendorCategoriesResponse = {
	success: boolean;
	data: GlobalVendorCategory[];
};

export type MenuCategory = {
	_id: string;
	vendor: string;
	name: string;
	type: "regular" | "extra";
	deliveryTime: string;
	deliveryType: string;
};

export type MenuItem = {
	_id: string;
	vendor: string;
	category: MenuCategory | string;
	name: string;
	description?: string;
	price: number;
	image?: string;
	isAvailable: boolean;
	quantity: number;
};

export type ExtraItem = {
	_id: string;
	vendor: string;
	category?: MenuCategory | string;
	name: string;
	description?: string;
	price: number;
	image?: string;
	isAvailable: boolean;
	quantity: number;
};

export type VendorMenuDetailsResponse = {
	success: boolean;
	data: {
		categories: MenuCategory[];
		items: MenuItem[];
		extras: ExtraItem[];
	};
};
