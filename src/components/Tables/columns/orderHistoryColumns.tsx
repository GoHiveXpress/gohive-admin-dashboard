/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { type BaseColumnSchema } from "@/components/Tables/types";
import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";

// Types
export type OrderHistory = {
	_id: string;
	orderId: string;
	status: string;
	createdAt: string;
	vendor: {
		vendorProfile: {
			businessName: string;
		};
	};
	deliveryAddress?: {
		address: string;
	};
	totalAmount: number;
	customer: {
		name: string;
	};
	rider?: {
		name: string;
	};
};

// Column Config - No Action Column
export const orderHistoryColumns: BaseColumnSchema<OrderHistory>[] = [
	{
		key: "status",
		header: "Status",
		render: (row) => {
			let variantClass = "";
			let dotClass = "";

			const status = row.status.charAt(0).toUpperCase() + row.status.slice(1);

			switch (row.status) {
				case "delivered":
					variantClass = "bg-secondary/10 text-secondary";
					dotClass = "bg-secondary";
					break;
				case "pending":
				case "placed":
				case "accepted":
				case "preparing":
				case "ready":
				case "picked_up":
					variantClass = "bg-[#FDB900]/10 text-[#FDB900]";
					dotClass = "bg-[#FDB900]";
					break;
				case "cancelled":
				case "rejected":
				case "payment_failed":
					variantClass = "bg-destructive/10 text-destructive";
					dotClass = "bg-destructive";
					break;
				default:
					variantClass = "bg-muted text-muted-foreground";
					dotClass = "bg-muted-foreground";
			}

			return (
				<Badge
					variant="outline"
					className={`rounded-full border-none px-3 py-1 font-medium ${variantClass}`}
				>
					<div className={`mr-2 size-2 rounded-full ${dotClass}`} />
					{status}
				</Badge>
			);
		},
	},
	{
		key: "createdAt",
		header: "Date",
		render: (row) => <span>{format(new Date(row.createdAt), "MMM d, yyyy")}</span>,
	},
	{
		key: "vendor",
		header: "Vendor",
		render: (row) => <span>{row.vendor?.vendorProfile?.businessName || "N/A"}</span>,
	},
	{
		key: "location",
		header: "Location",
		render: (row) => (
			<div className="max-w-[150px] truncate">{row.deliveryAddress?.address || "N/A"}</div>
		),
	},
	{
		key: "totalAmount",
		header: "Amount",
		render: (row) => (
			<span className="font-semibold">₦{row.totalAmount?.toLocaleString()}</span>
		),
	},
];

/* eslint-enable */
