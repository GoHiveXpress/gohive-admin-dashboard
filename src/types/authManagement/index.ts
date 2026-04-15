// src/types/authManagement/index.ts
export type LoginRequest = {
	email: string;
	password: string;
	isAdmin?: boolean; // 👈 Added this
};

export type User = {
	_id: string;
	name: string;
	email: string;
	role: "superadmin" | "admin" | "customer" | "vendor" | "rider";
	isVerified: boolean;
	profilePicture?: string;
	createdAt: string;
};

export type VerifyOtpRequest = {
	email: string;
	otp: string;
};

export type LoginResponse = {
	success: boolean;
	message: string;
	token?: string;
	requireOtp?: boolean;
	email?: string;
	user?: User;
};

export type AuthResponse = {
	success: boolean;
	message: string;
	token?: string;
	user?: User;
};

export type CustomerListResponse = {
	success: boolean;
	data: User[];
};
