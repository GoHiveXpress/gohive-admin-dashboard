// src/lib/orderStatus.ts
// Every order status the backend uses, in the order an order moves through
// them. Status filters use this list so none of them can miss one.

export const ORDER_STATUS_OPTIONS = [
	{ value: "pending", label: "Awaiting payment" },
	{ value: "payment_failed", label: "Payment failed" },
	{ value: "placed", label: "Placed" },
	{ value: "accepted", label: "Accepted" },
	{ value: "preparing", label: "Preparing" },
	{ value: "ready", label: "Ready" },
	{ value: "picked_up", label: "Picked up" },
	{ value: "delivered", label: "Delivered" },
	{ value: "rejected", label: "Rejected" },
	{ value: "cancelled", label: "Cancelled" },
	{ value: "expired", label: "Expired" },
] as const;

export type OrderStatus = (typeof ORDER_STATUS_OPTIONS)[number]["value"];

export const orderStatusLabel = (status?: string) =>
	ORDER_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status ?? "";
