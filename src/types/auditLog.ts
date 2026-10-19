// src/types/auditLog.ts
import { type PaginatedResponse } from "@/types/pagination";

export interface AuditLogEntry {
	_id: string;
	// Populated from User; null if the admin account has since been deleted.
	actor: { _id: string; name?: string; email?: string; role?: string } | null;
	actorRole?: string;
	actorEmail?: string;
	action: string;
	method: string;
	path: string;
	targetId?: string;
	params?: Record<string, unknown>;
	body?: unknown; // secrets are redacted by the backend
	statusCode?: number;
	success?: boolean;
	ip?: string;
	userAgent?: string;
	createdAt: string;
}

export interface AuditLogFilters {
	page: number;
	limit: number;
	actor?: string;
	action?: string;
	targetId?: string;
	from?: string;
	to?: string;
	success?: "true" | "false";
}

export type AuditLogResponse = PaginatedResponse<AuditLogEntry>;
