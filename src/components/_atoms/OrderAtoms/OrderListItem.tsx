/* eslint-disable import/prefer-default-export, no-nested-ternary */
import React from "react";
import { cn } from "@/lib/utils";

interface OrderListItemProps {
	orderId: string;
	statusColor?: "yellow" | "red" | "green";
	isActive?: boolean;
}

export const OrderListItem: React.FC<OrderListItemProps> = ({
	orderId,
	statusColor = "red",
	isActive = false,
}) => {
	const dotColor =
		statusColor === "yellow"
			? "bg-primary"
			: statusColor === "green"
				? "bg-secondary"
				: "bg-destructive";

	return (
		<div
			className={cn(
				"flex items-center gap-3 p-4 rounded-lg border border-border cursor-pointer transition-colors bg-card",
				isActive ? "border-primary/50 shadow-sm" : "hover:border-primary/30",
			)}
		>
			<span className={cn("h-3 w-3 rounded-full", dotColor)} />
			<span className="text-foreground text-sm font-medium">Order ID: #{orderId}</span>
		</div>
	);
};

/* eslint-enable */
