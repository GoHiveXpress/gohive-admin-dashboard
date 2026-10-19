// src/app/api/ops.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import { type OpsExceptionsResponse, type OpsKpisResponse, type OpsMapResponse } from "@/types/ops";

export const opsApi = {
	getExceptions: () =>
		apiClient.get<OpsExceptionsResponse>(
			"/admin/ops/exceptions",
			"Failed to load the exceptions queue",
		),
	getKpis: () =>
		apiClient.get<OpsKpisResponse>("/admin/ops/kpis", "Failed to load today's figures"),
	getMap: () => apiClient.get<OpsMapResponse>("/admin/ops/map", "Failed to load the live map"),
};

/* eslint-enable */
