// src/types/supportManagement/index.ts

export type ChatRole = "customer" | "vendor" | "rider";
export type ChatStatus = "active" | "closed";
export type MessageType = "text" | "image" | "options";

// Matches gohive-backend/utils/supportTickets.js
export type TicketCategory =
	| "order_issue"
	| "late_delivery"
	| "missing_item"
	| "wrong_item"
	| "payment"
	| "refund"
	| "account"
	| "rider"
	| "vendor"
	| "app_bug"
	| "other";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "waiting_on_user" | "resolved";
export type TicketResolution =
	| "answered"
	| "refunded"
	| "replaced"
	| "order_fixed"
	| "duplicate"
	| "no_response"
	| "not_an_issue"
	| "other";

export interface ITicketOrder {
	_id: string;
	orderId: string;
	status: string;
	totalAmount?: number;
}

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
	// Ticket fields (chats from before tickets existed may lack them)
	ticketNumber?: number | null;
	category?: TicketCategory | null;
	priority?: TicketPriority | null;
	ticketStatus?: TicketStatus | null;
	order?: ITicketOrder | null;
	firstResponseAt?: string | null;
	closedAt?: string | null;
	resolvedAt?: string | null;
	resolvedByName?: string | null;
	resolution?: TicketResolution | null;
	resolutionNote?: string | null;
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
	category?: TicketCategory;
	priority?: TicketPriority;
	ticketStatus?: TicketStatus;
}

export interface ITicketUpdate {
	category?: TicketCategory;
	priority?: TicketPriority;
	status?: Exclude<TicketStatus, "resolved">;
	// An order code such as GH-123456, or "" to unlink
	orderCode?: string;
}

export interface ITicketResolution {
	resolution: TicketResolution;
	note?: string;
}

export interface ITicketResponse {
	success: boolean;
	message: string;
	data: ISupportChat;
}

export interface ITicketTiming {
	count: number;
	medianMs: number | null;
	averageMs: number | null;
}

export interface ITicketReport {
	from: string;
	to: string;
	truncated: boolean;
	totals: { opened: number; resolved: number; unresolved: number; neverAnswered: number };
	firstResponse: ITicketTiming;
	resolution: ITicketTiming;
	byCategory: Array<{
		category: TicketCategory | "uncategorised";
		count: number;
		resolved: number;
		medianResolutionMs: number | null;
	}>;
	byPriority: Array<{ priority: TicketPriority; count: number }>;
	byResolution: Array<{ resolution: TicketResolution; count: number }>;
	agents: Array<{
		agentId: string;
		name: string;
		handled: number;
		resolved: number;
		medianFirstResponseMs: number | null;
	}>;
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
	ticketNumber?: number | null;
	category?: TicketCategory | null;
	priority?: TicketPriority | null;
	ticketStatus?: TicketStatus | null;
	firstResponseAt?: string | null;
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
