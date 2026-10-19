// src/app/api/ops.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import { type OpsExceptionsResponse, type OpsKpisResponse } from "@/types/ops";

export const opsApi = {
	getExceptions: () =>
		apiClient.get<OpsExceptionsResponse>(
			"/admin/ops/exceptions",
			"Failed to load the exceptions queue",
		),
	getKpis: () =>
		apiClient.get<OpsKpisResponse>("/admin/ops/kpis", "Failed to load today's figures"),
};

/* eslint-enable */
