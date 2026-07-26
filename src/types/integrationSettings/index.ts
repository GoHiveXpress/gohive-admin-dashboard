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

export interface FeeStateOverride {
	state: string;
	serviceFeePercent?: number;
	deliveryBaseFee?: number;
	baseDistanceKm?: number;
	extraBlockDistanceKm?: number;
	extraBlockFee?: number;
	maxDistanceKm?: number;
}

export interface FeeConfig {
	_id: string;
	serviceFeePercent: number;
	deliveryBaseFee: number;
	baseDistanceKm: number;
	extraBlockDistanceKm: number;
	extraBlockFee: number;
	maxDistanceKm: number;
	stateOverrides: FeeStateOverride[];
	updatedAt: string;
	createdAt: string;
}

export type UpdateFeeConfigPayload = Partial<
	Pick<
		FeeConfig,
		| "serviceFeePercent"
		| "deliveryBaseFee"
		| "baseDistanceKm"
		| "extraBlockDistanceKm"
		| "extraBlockFee"
		| "maxDistanceKm"
	>
> & {
	stateOverrides?: FeeStateOverride[];
};

export interface IntegrationListResponse<T> {
	success: boolean;
	data: T[];
}

export interface IntegrationSingleResponse<T> {
	success: boolean;
	message?: string;
	data: T;
}
