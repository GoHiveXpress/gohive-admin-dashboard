// src/app/api/auditLogs.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import { type AuditLogFilters, type AuditLogResponse } from "@/types/auditLog";

export const auditLogApi = {
	// Read-only: the backend exposes no update or delete for audit entries.
	getAuditLogs: (filters: AuditLogFilters) => {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== "") params.append(key, String(value));
		});
		return apiClient.get<AuditLogResponse>(
			`/admin/audit-logs?${params.toString()}`,
			"Failed to fetch audit logs",
		);
	},
};

/* eslint-enable */
