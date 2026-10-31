// src/lib/orderTimeline.ts
// Builds an order's progress steps from the timestamps the backend stamps on
// it, so both order screens show the same real times.

export type OrderTimestamps = {
	status: string;
	createdAt?: string;
	updatedAt?: string;
	orderAcceptedAt?: string;
	orderReadyAt?: string;
	riderAssignedAt?: string;
	orderPickedUpAt?: string;
	orderDeliveredAt?: string;
	orderEndedAt?: string;
	paymentFailedAt?: string;
};

export type TimelineStepState = "done" | "pending" | "failed";

export type TimelineStep = {
	key: string;
	label: string;
	state: TimelineStepState;
	at?: string;
};

const PROGRESS = ["placed", "accepted", "preparing", "ready", "picked_up", "delivered"] as const;

const STEP_LABELS: Record<(typeof PROGRESS)[number], string> = {
	placed: "Placed",
	accepted: "Accepted",
	preparing: "Preparing",
	ready: "Ready",
	picked_up: "Picked up",
	delivered: "Delivered",
};

const ENDED_LABELS: Record<string, string> = {
	payment_failed: "Payment failed",
	rejected: "Rejected by vendor",
	cancelled: "Cancelled",
	expired: "Expired (not accepted in time)",
};

export const isEndedStatus = (status: string) => status in ENDED_LABELS;

const stepTime = (order: OrderTimestamps, key: (typeof PROGRESS)[number]) => {
	switch (key) {
		case "placed":
			return order.createdAt;
		case "accepted":
			return order.orderAcceptedAt;
		case "ready":
			return order.orderReadyAt;
		case "picked_up":
			return order.orderPickedUpAt;
		case "delivered":
			return order.orderDeliveredAt;
		default:
			// The backend keeps no time for "preparing"
			return undefined;
	}
};

export function buildOrderTimeline(order: OrderTimestamps): TimelineStep[] {
	const currentIdx = PROGRESS.indexOf(order.status as (typeof PROGRESS)[number]);

	if (!isEndedStatus(order.status)) {
		return PROGRESS.map((key, idx) => ({
			key,
			label: STEP_LABELS[key],
			state: currentIdx >= idx ? "done" : "pending",
			at: currentIdx >= idx ? stepTime(order, key) : undefined,
		}));
	}

	// An ended order shows only the steps it reached, then where it stopped.
	// payment_failed orders were never placed.
	const reached: TimelineStep[] =
		order.status === "payment_failed"
			? []
			: PROGRESS.filter((key) => key === "placed" || stepTime(order, key) !== undefined).map(
					(key) => ({
						key,
						label: STEP_LABELS[key],
						state: "done",
						at: stepTime(order, key),
					}),
				);

	return [
		...reached,
		{
			key: order.status,
			label: ENDED_LABELS[order.status] ?? order.status,
			state: "failed",
			at: order.orderEndedAt ?? order.paymentFailedAt ?? order.updatedAt,
		},
	];
}

export const formatStepTime = (at?: string) =>
	at
		? new Date(at).toLocaleString([], {
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			})
		: undefined;
