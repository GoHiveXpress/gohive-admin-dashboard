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
	// The user has the app open right now (sent by GET /support-chat/admin/all)
	userOnline?: boolean;
	// User messages this agent hasn't read yet
	unreadCount?: number;
	// When the chat started waiting for an agent (unassigned active chats only)
	waitingSince?: string | null;
	lastUserMessageAt?: string | null;
	myReadAt?: string | null;
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
	// Chats per role for the current status/search (ignores the role filter)
	counts?: Record<ChatRole, number>;
	hasMore?: boolean;
	nextBefore?: string | null;
}

export interface IChatListParams {
	status?: ChatStatus;
	role?: ChatRole;
	search?: string;
}

// Sent to agents on "support_chat_activity" whenever a chat changes
export interface IChatActivity {
	chatId: string;
	status?: ChatStatus;
	lastMessage?: string;
	admin?: string | null;
	adminName?: string | null;
	agentRequestedAt?: string | null;
	role?: ChatRole;
	lastUserMessageAt?: string | null;
	waitingSince?: string | null;
	updatedAt?: string;
	senderRole?: string;
	isNew?: boolean;
}

export interface IQuickReply {
	_id: string;
	title: string;
	body: string;
	createdByName?: string;
	createdAt: string;
}

export interface IChatContext {
	orders: Array<{
		_id: string;
		orderId: string;
		status: string;
		totalAmount: number;
		createdAt: string;
	}>;
	orderCount: number;
	wallet: { balance: number; currency: string } | null;
	pendingRefunds: number;
}

export interface IGetChatHistoryResponse {
	success: boolean;
	data: ISupportMessage[];
}

export interface ISendMessageResponse {
	success: boolean;
	data: ISupportMessage;
}
