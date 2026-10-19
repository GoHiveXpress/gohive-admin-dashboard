// src/types/ops.ts
// Live operations dashboard: GET /admin/ops/exceptions and GET /admin/ops/kpis.

export type ExceptionType =
	| "vendor_not_accepting"
	| "no_rider"
	| "slow_preparation"
	| "pickup_delayed"
	| "delivery_delayed";

export type ExceptionSeverity = "warning" | "critical";

export interface OpsContact {
	_id: string;
	name?: string;
	phone?: string;
}

export interface OpsException {
	type: ExceptionType;
	label: string;
	severity: ExceptionSeverity;
	since: string;
	minutes: number;
	thresholdMinutes: number;
	order: {
		_id: string;
		orderId: string;
		status: string;
		totalAmount: number;
		state: string | null;
		address: string | null;
		createdAt: string;
		customer: OpsContact | null;
		vendor: OpsContact | null;
		rider: OpsContact | null;
	};
}

export interface OpsExceptionRule {
	type: ExceptionType;
	label: string;
	warnAfter: number;
	criticalAfter: number;
}

export interface OpsExceptionsResponse {
	success: boolean;
	data: {
		generatedAt: string;
		activeOrders: number;
		counts: {
			total: number;
			critical: number;
			warning: number;
			byType: Partial<Record<ExceptionType, number>>;
		};
		rules: OpsExceptionRule[];
		items: OpsException[];
	};
}

export interface OpsWindowStats {
	orders: number;
	delivered: number;
	cancelled: number;
	gmv: number;
	avgDeliveryMinutes: number | null;
	newCustomers: number;
}

export interface OpsTrendPoint {
	day: string;
	orders: number;
	delivered: number;
	cancelled: number;
	gmv: number;
}

// Percent vs the same hours last week; null when last week had nothing.
export type OpsChange = Record<
	"orders" | "delivered" | "cancelled" | "gmv" | "newCustomers",
	number | null
>;

export interface OpsKpisResponse {
	success: boolean;
	data: {
		generatedAt: string;
		today: OpsWindowStats;
		lastWeek: OpsWindowStats;
		change: OpsChange;
		trend: OpsTrendPoint[];
		live: { activeOrders: number; ridersOnline: number; vendorsOnline: number };
	};
}

export interface LatLng {
	lat: number;
	lng: number;
}

export type RiderMapStatus = "online" | "busy";

export interface OpsMapRider {
	_id: string;
	name: string | null;
	phone: string | null;
	status: RiderMapStatus;
	vehicleType: string | null;
	// null until the rider has shared a location
	position: LatLng | null;
	lastLocationAt: string | null;
	activeOrderId: string | null;
}

export interface OpsMapOrder {
	_id: string;
	orderId: string;
	status: string;
	state: string | null;
	riderId: string | null;
	vendorName: string | null;
	pickup: LatLng | null;
	dropoff: LatLng | null;
	dropoffAddress: string | null;
	exception: { label: string; severity: ExceptionSeverity; minutes: number } | null;
}

export interface OpsMapResponse {
	success: boolean;
	data: {
		generatedAt: string;
		riders: OpsMapRider[];
		orders: OpsMapOrder[];
	};
}

// Payload of the "admin:rider_location" socket event.
export interface RiderLocationEvent {
	riderId: string;
	lat: number;
	lng: number;
	orderId: string | null;
	at: string;
}

// Payload of the "admin:orders_changed" socket event.
export interface OrdersChangedEvent {
	changes: { orderId: string | null; status: string | null; kind: string }[];
	total: number;
	at: string;
}
