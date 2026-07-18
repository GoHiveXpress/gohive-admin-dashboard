export type IntegrationStatus = "Active" | "Inactive";

export interface ApiKeyItem {
	_id: string;
	description: string;
	apiKey: string;
	oneTimeKey?: string;
	status: IntegrationStatus;
	timestamp: string;
	createdAt: string;
	lastUsedAt?: string;
}

export interface WebhookItem {
	_id: string;
	url: string;
	description: string;
	status: IntegrationStatus;
	timestamp: string;
	createdAt: string;
	lastTriggeredAt?: string;
}

export interface IntegrationListResponse<T> {
	success: boolean;
	data: T[];
}

export interface IntegrationSingleResponse<T> {
	success: boolean;
	message?: string;
	data: T;
}
