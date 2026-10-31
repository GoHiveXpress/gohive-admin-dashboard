import { apiClient } from "@/lib/apiClient";
import {
	type FeeConfig,
	type FeeHistoryEntry,
	type IntegrationListResponse,
	type IntegrationSingleResponse,
	type UpdateFeeConfigPayload,
	type WebhookDeliveriesResponse,
	type WebhookItem,
	type WebhookPayload,
	type WebhookTestResponse,
	type WebhookWithSecret,
} from "@/types/integrationSettings";

const ADMIN_BASE = "/admin";

// Named export: hooks import it as { integrationSettingsApi }.
// eslint-disable-next-line import/prefer-default-export
export const integrationSettingsApi = {
	getFeeConfig: () =>
		apiClient.get<IntegrationSingleResponse<FeeConfig>>(
			`${ADMIN_BASE}/fee-config`,
			"Failed to fetch fee configuration",
		),

	getFeeHistory: () =>
		apiClient.get<IntegrationListResponse<FeeHistoryEntry>>(
			`${ADMIN_BASE}/fee-config/history`,
			"Failed to fetch fee history",
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

	getWebhookEvents: () =>
		apiClient.get<IntegrationListResponse<string>>(
			`${ADMIN_BASE}/webhooks/events`,
			"Failed to fetch webhook events",
		),

	createWebhook: (payload: WebhookPayload & { url: string }) =>
		apiClient.post<IntegrationSingleResponse<WebhookWithSecret>, WebhookPayload>(
			`${ADMIN_BASE}/webhooks`,
			payload,
			"Failed to create webhook",
		),

	updateWebhook: (id: string, payload: WebhookPayload) =>
		apiClient.put<IntegrationSingleResponse<WebhookItem>, WebhookPayload>(
			`${ADMIN_BASE}/webhooks/${id}`,
			payload,
			"Failed to update webhook",
		),

	deleteWebhook: (id: string) =>
		apiClient.delete<{ success: boolean; message: string }>(
			`${ADMIN_BASE}/webhooks/${id}`,
			"Failed to delete webhook",
		),

	rotateWebhookSecret: (id: string) =>
		apiClient.post<IntegrationSingleResponse<WebhookWithSecret>, Record<string, never>>(
			`${ADMIN_BASE}/webhooks/${id}/rotate-secret`,
			{},
			"Failed to rotate the secret",
		),

	testWebhook: (id: string) =>
		apiClient.post<WebhookTestResponse, Record<string, never>>(
			`${ADMIN_BASE}/webhooks/${id}/test`,
			{},
			"Failed to send a test event",
		),

	getWebhookDeliveries: (id: string, page: number) =>
		apiClient.get<WebhookDeliveriesResponse>(
			`${ADMIN_BASE}/webhooks/${id}/deliveries?page=${page}&limit=20`,
			"Failed to fetch deliveries",
		),
};
