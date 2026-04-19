"use client";

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import UserActionCell from "@/components/Tables/cells/UserActionCell"; // Import the cell
import { type BaseColumnSchema } from "../types";
import { cn } from "@/lib/utils";

export type RiderUserData = {
	id: string;
	riderName: string;
	riderId: string;
	vehicleType: string;
	phone: string;
	date: string;
	rating: number;
	status: "Active" | "Offline";
};

export const riderUserColumns: BaseColumnSchema<RiderUserData>[] = [
	// ... existing columns ...
	{
		key: "riderName",
		header: "Store Name", // Keeping label as per design, assuming Rider Name
		render: (row) => (
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<Icon icon="ph:circle-fill" className="text-secondary size-2" />
					<span className="text-foreground text-sm font-semibold">{row.riderName}</span>
				</div>
				<div className="ml-4 mt-0.5 flex items-center gap-1">
					<span className="text-muted-foreground text-[10px]">Rider ID Number:</span>
					<span className="border-border bg-muted/20 rounded border px-1.5 py-0.5 text-[10px]">
						{row.riderId}
					</span>
				</div>
			</div>
		),
	},
	{
		key: "vehicleType",
		header: "Vehicle Type",
		render: (row) => <span className="text-foreground text-sm">{row.vehicleType}</span>,
	},
	{
		key: "phone",
		header: "Phone Number",
		render: (row) => <span className="text-foreground text-sm">{row.phone}</span>,
	},
	{
		key: "date",
		header: "Date & Time Stamp",
		render: (row) => <span className="text-muted-foreground text-sm">{row.date}</span>,
	},
	{
		key: "rating",
		header: "Rating",
		render: (row) => (
			<div className="flex items-center gap-1">
				<Icon icon="ph:star-fill" className="text-primary size-4" />
				<span className="text-sm font-medium">{row.rating.toFixed(1)}</span>
			</div>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row) => (
			<Badge
				variant="outline"
				className={cn(
					"rounded-full px-3 py-1 font-medium shadow-none",
					row.status === "Active"
						? "bg-secondary/10 text-secondary border-secondary/20"
						: "bg-destructive/10 text-destructive border-destructive/20"
				)}
			>
				<Icon 
					icon="ph:circle-fill" 
					className={cn("mr-2 size-2", row.status === "Active" ? "text-secondary" : "text-destructive")} 
				/>
				{row.status}
			</Badge>
		),
	},
	// UPDATED ACTION COLUMN
	{
		key: "action",
		header: "",
		render: (row) => <UserActionCell userType="rider" rowId={row.id} />,
	},
];
