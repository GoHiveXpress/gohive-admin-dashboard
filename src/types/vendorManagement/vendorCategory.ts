// src/types/vendorManagement/vendorCategory.ts

export interface IVendorCategory {
	_id: string;
	title: string;
	subtitle: string;
	value: string;
	backgroundColor: string;
	imageUrl: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ICreateVendorCategory {
	title: string;
	subtitle: string;
	value: string;
	backgroundColor: string;
	image: File;
}
