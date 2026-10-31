export type IntegrationStatus = "Active" | "Inactive";

export interface WebhookItem {
	_id: string;
	url: string;
	description: string;
	status: IntegrationStatus;
	// Order events it gets; empty means all of them
	events: string[];
	consecutiveFailures: number;
	// Set when GoHive switched it off after repeated failures
	disabledReason: string | null;
	timestamp: string;
	createdAt: string;
	lastTriggeredAt?: string;
	lastFailureAt?: string;
}

// Returned only when an endpoint is created or its secret is rotated
export interface WebhookWithSecret extends WebhookItem {
	secret: string;
}

export interface WebhookPayload {
	url?: string;
	description?: string;
	status?: IntegrationStatus;
	events?: string[];
}

export interface WebhookDelivery {
	_id: string;
	event: string;
	status: "pending" | "delivered" | "failed";
	attempts: number;
	responseStatus?: number | null;
	lastError?: string | null;
	createdAt: string;
	deliveredAt?: string | null;
	nextAttemptAt?: string | null;
	lastAttemptAt?: string | null;
	payload?: unknown;
}

export interface WebhookDeliveriesResponse {
	success: boolean;
	data: WebhookDelivery[];
	pagination: { page: number; limit: number; total: number; pages: number };
}

export interface WebhookTestResponse {
	success: boolean;
	message: string;
	data: { ok: boolean; status: number | null; error: string | null };
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

export type FeeField =
	| "serviceFeePercent"
	| "deliveryBaseFee"
	| "baseDistanceKm"
	| "extraBlockDistanceKm"
	| "extraBlockFee"
	| "maxDistanceKm";

export interface FeeChange {
	// "default" or a state name
	scope: string;
	// A fee field, or "added" / "removed" for a whole state override
	field: FeeField | "added" | "removed";
	from: number | FeeStateOverride | null;
	to: number | FeeStateOverride | null;
}

export interface FeeHistoryEntry {
	_id: string;
	changedByName?: string;
	changes: FeeChange[];
	createdAt: string;
}
