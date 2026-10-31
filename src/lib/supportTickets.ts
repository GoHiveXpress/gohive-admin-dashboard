// Labels and timings for support tickets. Mirrors gohive-backend/utils/supportTickets.js.
import {
	type ISupportChat,
	type TicketCategory,
	type TicketPriority,
	type TicketResolution,
	type TicketStatus,
} from "@/types/supportManagement";

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
	order_issue: "Order issue",
	late_delivery: "Late delivery",
	missing_item: "Missing item",
	wrong_item: "Wrong item",
	payment: "Payment",
	refund: "Refund",
	account: "Account",
	rider: "Rider",
	vendor: "Vendor",
	app_bug: "App problem",
	other: "Other",
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
	low: "Low",
	normal: "Normal",
	high: "High",
	urgent: "Urgent",
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
	open: "Open",
	in_progress: "In progress",
	waiting_on_user: "Waiting on user",
	resolved: "Resolved",
};

export const TICKET_RESOLUTION_LABELS: Record<TicketResolution, string> = {
	answered: "Question answered",
	refunded: "Refunded",
	replaced: "Item replaced",
	order_fixed: "Order fixed",
	duplicate: "Duplicate ticket",
	no_response: "User stopped replying",
	not_an_issue: "Not an issue",
	other: "Other",
};

export const TICKET_CATEGORIES = Object.keys(TICKET_CATEGORY_LABELS) as TicketCategory[];
export const TICKET_PRIORITIES = Object.keys(TICKET_PRIORITY_LABELS) as TicketPriority[];
export const TICKET_STATUSES = Object.keys(TICKET_STATUS_LABELS) as TicketStatus[];
export const TICKET_RESOLUTIONS = Object.keys(TICKET_RESOLUTION_LABELS) as TicketResolution[];

export const categoryLabel = (category?: string | null) =>
	category && category in TICKET_CATEGORY_LABELS
		? TICKET_CATEGORY_LABELS[category as TicketCategory]
		: "Uncategorised";

/** T-00042; chats from before ticket numbers existed show the end of their id. */
export const ticketCode = (chat: Pick<ISupportChat, "_id" | "ticketNumber">) =>
	chat.ticketNumber && chat.ticketNumber > 0
		? `T-${String(chat.ticketNumber).padStart(5, "0")}`
		: `#${chat._id.slice(-6).toUpperCase()}`;

/** Older chats have no ticket status or priority yet: they count as open and normal. */
export const ticketStatusOf = (chat: Pick<ISupportChat, "ticketStatus">): TicketStatus =>
	chat.ticketStatus ?? "open";

export const priorityOf = (chat: Pick<ISupportChat, "priority">): TicketPriority =>
	chat.priority ?? "normal";

/** 45s, 12m, 3h 5m, 2d 4h */
export const formatDuration = (ms?: number | null) => {
	if (ms === null || ms === undefined || !Number.isFinite(ms)) return "—";
	const minutes = Math.floor(ms / 60_000);
	if (minutes < 1) return `${Math.max(0, Math.round(ms / 1000))}s`;
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return minutes % 60 ? `${hours}h ${minutes % 60}m` : `${hours}h`;
	const days = Math.floor(hours / 24);
	return hours % 24 ? `${days}d ${hours % 24}h` : `${days}d`;
};

// How long before an unanswered ticket counts as late
export const FIRST_RESPONSE_TARGET_MS = 15 * 60_000;

export interface ResponseTimer {
	label: string;
	tone: "ok" | "warning" | "late" | "muted";
}

/**
 * The response clock on a ticket: how long the first agent reply took, or how long
 * the user has been waiting for one (late after 15 minutes).
 */
export const responseTimer = (
	chat: Pick<
		ISupportChat,
		"createdAt" | "agentRequestedAt" | "firstResponseAt" | "status" | "ticketStatus"
	>,
	now: number,
): ResponseTimer => {
	const start = new Date(chat.agentRequestedAt ?? chat.createdAt).getTime();
	if (chat.firstResponseAt) {
		const took = new Date(chat.firstResponseAt).getTime() - start;
		return {
			label: `Answered in ${formatDuration(Math.max(took, 0))}`,
			tone: took > FIRST_RESPONSE_TARGET_MS ? "warning" : "ok",
		};
	}
	if (chat.status === "closed" || ticketStatusOf(chat) === "resolved") {
		return { label: "Never answered", tone: "muted" };
	}
	const waited = Math.max(now - start, 0);
	return {
		label: `No reply for ${formatDuration(waited)}`,
		tone: waited > FIRST_RESPONSE_TARGET_MS ? "late" : "warning",
	};
};

/** yyyy-mm-dd in local time, for date inputs and the report range. */
export const toDateInput = (date: Date) => {
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
