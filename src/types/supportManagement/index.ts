// src/types/supportManagement/index.ts

export type ChatRole = "customer" | "vendor" | "rider";
export type ChatStatus = "active" | "closed";
export type MessageType = "text" | "image" | "options";

export interface ISupportUser {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	role: ChatRole | "superadmin" | "staff";
	profilePicture?: string;
	dob?: string;
	location?: {
		address?: string;
	};
	vendorProfile?: {
		businessName?: string;
		personalAvatar?: string;
	};
	riderProfile?: {
		personalAvatar?: string;
	};
}

export interface ISupportChat {
	_id: string;
	user: ISupportUser;
	role: ChatRole;
	admin?: ISupportUser | string;
	adminName?: string;
	// Set when the user asked for a live agent
	agentRequestedAt?: string | null;
	lastMessage: string;
	status: ChatStatus;
	createdAt: string;
	updatedAt: string;
}

export interface ISupportMessage {
	_id: string;
	chat: string;
	sender: ISupportUser | string;
	content: string;
	type: MessageType;
	isSupportResponse: boolean;
	isSystem?: boolean;
	options?: Array<{ label: string; value: string }>;
	createdAt: string;
	updatedAt: string;
}

export interface IGetAllChatsResponse {
	success: boolean;
	data: ISupportChat[];
}

export interface IGetChatHistoryResponse {
	success: boolean;
	data: ISupportMessage[];
}

export interface ISendMessageResponse {
	success: boolean;
	data: ISupportMessage;
}
