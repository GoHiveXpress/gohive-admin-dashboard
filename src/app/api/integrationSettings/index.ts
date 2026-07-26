import { apiClient } from "@/lib/apiClient";
import {
	type ApiKeyItem,
	type FeeConfig,
	type IntegrationListResponse,
	type IntegrationSingleResponse,
	type UpdateFeeConfigPayload,
	type WebhookItem,
} from "@/types/integrationSettings";

const ADMIN_BASE = "/admin";

export const integrationSettingsApi = {
	getApiKeys: () =>
		apiClient.get<IntegrationListResponse<ApiKeyItem>>(
			`${ADMIN_BASE}/api-keys`,
			"Failed to fetch API keys",
		),

	createApiKey: (description: string) =>
		apiClient.post<IntegrationSingleResponse<ApiKeyItem>, { description: string }>(
			`${ADMIN_BASE}/api-keys`,
			{ description },
			"Failed to generate API key",
		),

	updateApiKeyStatus: (id: string, status: "Active" | "Inactive") =>
		apiClient.put<IntegrationSingleResponse<ApiKeyItem>, { status: "Active" | "Inactive" }>(
			`${ADMIN_BASE}/api-keys/${id}/status`,
			{ status },
			"Failed to update API key",
		),

	deleteApiKey: (id: string) =>
		apiClient.delete<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/api-keys/${id}`,
			"Failed to delete API key",
		),

	getFeeConfig: () =>
		apiClient.get<IntegrationSingleResponse<FeeConfig>>(
			`${ADMIN_BASE}/fee-config`,
			"Failed to fetch fee configuration",
		),

	updateFeeConfig: (payload: UpdateFeeConfigPayload) =>
		apiClient.put<IntegrationSingleResponse<FeeConfig>, UpdateFeeConfigPayload>(
			`${ADMIN_BASE}/fee-config`,
			payload,
			"Failed to update fee configuration",
		),

	getWebhooks: () =>
		apiClient.get<IntegrationListResponse<WebhookItem>>(
			`${ADMIN_BASE}/webhooks`,
			"Failed to fetch webhooks",
		),

	createWebhook: (payload: { url: string; description?: string }) =>
		apiClient.post<IntegrationSingleResponse<WebhookItem>, { url: string; description?: string }>(
			`${ADMIN_BASE}/webhooks`,
			payload,
			"Failed to create webhook",
		),

	updateWebhook: (id: string, payload: { url?: string; description?: string; status?: "Active" | "Inactive" }) =>
		apiClient.put<IntegrationSingleResponse<WebhookItem>, { url?: string; description?: string; status?: "Active" | "Inactive" }>(
			`${ADMIN_BASE}/webhooks/${id}`,
			payload,
			"Failed to update webhook",
		),

	deleteWebhook: (id: string) =>
		apiClient.delete<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/webhooks/${id}`,
			"Failed to delete webhook",
		),
};
