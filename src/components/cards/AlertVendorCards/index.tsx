"use client";

/* eslint-disable react/no-array-index-key */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type OrderCardData = {
	id: string;
	vendorName: string;
	time: string;
	eta: string;
	status: string; // Dynamic DB status
	items: string[];
};

interface AlertVendorCardProps {
	data: OrderCardData;
	onAlertVendor?: (orderId: string) => void;
	isAlerting?: boolean;
}

export default function AlertVendorCard({ data, onAlertVendor, isAlerting }: AlertVendorCardProps) {
	// Helper to determine styles based on status
	const getStatusStyles = (status: OrderCardData["status"]) => {
		switch (status) {
			case "pending":
			case "placed":
				return {
					badgeBg: "bg-primary/10",
					badgeText: "text-primary", // Yellow/Orange
					dot: "bg-primary",
				};
			case "accepted":
			case "preparing":
				return {
					badgeBg: "bg-blue-100",
					badgeText: "text-blue-500",
					dot: "bg-blue-500",
				};
			case "ready":
			case "picked_up":
			case "delivered":
				return {
					badgeBg: "bg-green-100",
					badgeText: "text-green-600",
					dot: "bg-green-600",
				};
			case "payment_failed":
			case "rejected":
			case "cancelled":
			case "expired":
				return {
					badgeBg: "bg-destructive/10",
					badgeText: "text-destructive",
					dot: "bg-destructive",
				};
			case "Delayed": // For legacy mock mapped inputs if any
				return {
					badgeBg: "bg-destructive/10",
					badgeText: "text-destructive",
					dot: "bg-destructive",
				};
			default:
				return {
					badgeBg: "bg-muted",
					badgeText: "text-muted-foreground",
					dot: "bg-gray-400",
				};
		}
	};

	const styles = getStatusStyles(data.status);

	return (
		<div className="border-border/50 flex flex-col gap-4 rounded-[20px] border bg-white p-5 shadow-sm">
			{/* Header: Name, Time, Status */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-foreground text-base font-bold">{data.vendorName}</h3>
					<p className="text-muted-foreground mt-1 text-sm">ETA: {data.eta}</p>
				</div>
				<div className="flex flex-col items-end gap-2">
					<div className="text-foreground flex items-center gap-2 text-sm font-bold">
						{data.time} <span className="text-muted-foreground font-normal">|</span>
						<Badge
							variant="outline"
							className={`rounded-full border-none px-3 py-1 ${styles.badgeBg} ${styles.badgeText} hover:${styles.badgeBg}`}
						>
							<div className={`mr-2 size-2 rounded-full ${styles.dot}`} />
							<span className="capitalize">{data.status.replace("_", " ")}</span>
						</Badge>
					</div>
				</div>
			</div>

			<hr className="border-border/50" />

			{/* Items List */}
			<div className="space-y-2 py-1">
				{data.items.map((item, idx) => (
					<p key={idx} className="text-foreground text-sm font-medium">
						{item}
					</p>
				))}
			</div>

			{/* Action Button */}
			<Button
				variant="outline"
				className="border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive mt-auto h-11 w-full rounded-lg relative"
				onClick={() => onAlertVendor?.(data.id)}
				disabled={isAlerting}
			>
				{isAlerting ? "Alerting..." : "Alert Vendor"}
			</Button>
		</div>
	);
}

/* eslint-enable */
