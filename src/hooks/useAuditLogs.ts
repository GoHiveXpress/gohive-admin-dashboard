// src/hooks/useAuditLogs.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditLogApi } from "@/app/api/auditLogs";
import { type AuditLogFilters } from "@/types/auditLog";

// eslint-disable-next-line import/prefer-default-export
export const useAuditLogs = (filters: AuditLogFilters, enabled = true) => {
	return useQuery({
		queryKey: ["admin_audit_logs", filters],
		queryFn: () => auditLogApi.getAuditLogs(filters),
		enabled,
		placeholderData: keepPreviousData,
		staleTime: 30 * 1000,
	});
};
