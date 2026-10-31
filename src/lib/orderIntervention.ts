// src/lib/orderIntervention.ts
// What support may do to a live order. Mirrors gohive-backend/utils/orderIntervention.js,
// which has the final say; this only decides which controls to show.

export const CANCELLABLE_STATUSES = [
	"pending",
	"placed",
	"accepted",
	"preparing",
	"ready",
	"picked_up",
];
const RIDER_ASSIGNABLE_STATUSES = ["placed", "accepted", "preparing", "ready", "picked_up"];
const RIDER_REMOVABLE_STATUSES = ["placed", "accepted", "preparing", "ready"];
const FORWARD_PATH = ["placed", "preparing", "ready", "picked_up", "delivered"];

const pathIndex = (status: string) =>
	FORWARD_PATH.indexOf(status === "accepted" ? "preparing" : status);

interface InterventionOrder {
	status: string;
	paymentStatus?: string;
	rider?: { _id?: string } | null;
}

export const canCancel = (order: InterventionOrder) => CANCELLABLE_STATUSES.includes(order.status);

export const canAssignRider = (order: InterventionOrder) =>
	RIDER_ASSIGNABLE_STATUSES.includes(order.status);

export const canRemoveRider = (order: InterventionOrder) =>
	Boolean(order.rider) && RIDER_REMOVABLE_STATUSES.includes(order.status);

// The statuses an order can be pushed forward to. Picked up and delivered need
// a rider, and delivered needs the payment to have come in.
export const overrideTargets = (order: InterventionOrder) => {
	const from = pathIndex(order.status);
	if (from === -1) return [];
	return FORWARD_PATH.slice(from + 1).filter((status) => {
		if ((status === "picked_up" || status === "delivered") && !order.rider) return false;
		if (status === "delivered" && order.paymentStatus !== "completed") return false;
		return true;
	});
};
