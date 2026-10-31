// src/types/accountTools.ts
// Phase 9 admin tools: customer account actions, vendor store controls and
// admin sign-in sessions.
import { type PaginationMeta } from "@/types/pagination";
import { type OperatingHours } from "@/types/vendorManagement";

export interface ActionResponse {
	success: boolean;
	message: string;
}

export interface WalletTransaction {
	_id: string;
	type: "credit" | "debit";
	amount: number;
	category:
		| "order_payout"
		| "withdrawal"
		| "wallet_topup"
		| "referral_bonus"
		| "refund"
		| "order_payment"
		| "adjustment";
	status: "pending" | "completed" | "failed";
	description?: string;
	reference?: string;
	orderId?: { _id: string; orderId: string } | null;
	createdAt: string;
}

export interface CustomerWalletResponse {
	success: boolean;
	data: {
		balance: number;
		currency: string;
		accountNumber: string | null;
		bankName: string | null;
		transactions: WalletTransaction[];
	};
	pagination: PaginationMeta;
}

export interface AdminNote {
	_id: string;
	text: string;
	authorName?: string;
	createdAt: string;
}

export interface AdminNotesResponse {
	success: boolean;
	data: AdminNote[];
}

export interface VendorClosure {
	at: string;
	until: string | null;
	reason: string;
}

export interface VendorHoursResponse {
	success: boolean;
	message: string;
	data: OperatingHours[];
}

export interface AdminSession {
	_id: string;
	device: string;
	ip: string | null;
	signedInAt: string;
	lastSeenAt: string;
	expiresAt: string;
	current: boolean;
}

export interface AdminSessionsResponse {
	success: boolean;
	data: AdminSession[];
}

export interface SignOutOthersResponse extends AdminSessionsResponse {
	message: string;
	// A fresh token for this browser; the old one stopped working
	token: string | null;
}
