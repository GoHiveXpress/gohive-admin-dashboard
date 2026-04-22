// src/types/userManagement/index.ts

import { type Customer } from "../customerManagement";
import { type VendorUser } from "../vendorManagement";
import { type RiderUser } from "../riderManagement";

export type AccountStatus = "Active" | "Inactive" | "Suspend";

export interface UserBase {
	_id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	profilePicture?: string;
	accountStatus: AccountStatus;
	createdAt: string;
}

// Re-export specific types so components can use them consistently
export type { Customer as CustomerUser, VendorUser, RiderUser };

export interface AdminUser extends UserBase {
	role: "superadmin" | "staff";
}

export interface InviteStaffRequest {
	email: string;
}

export interface UserListResponse<T> {
	success: boolean;
	data: T[];
}

export interface GenericResponse {
	success: boolean;
	message: string;
}
export interface AdminProfileUpdate {
	name?: string;
	phone?: string;
	bvn?: string;
	profilePicture?: string;
	email?: string;
}

export interface ChangePasswordRequest {
	newPassword: string;
}

export interface Invitation {
	_id: string;
	email: string;
	role: "superadmin" | "staff";
	status: "pending" | "accepted" | "expired" | "cancelled";
	token: string;
	expiresAt: string;
	createdAt: string;
}

export interface RegisterStaffRequest {
	token: string;
	name: string;
	phone: string;
	password: string;
	dob?: string;
	profilePicture?: string;
}
