"use client";

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import UserActionCell from "@/components/Tables/cells/UserActionCell"; // Import the cell
import { type BaseColumnSchema } from "../types";
import { cn } from "@/lib/utils";

export type CustomerUserData = {
	id: string;
	name: string;
	customerId: string;
	email: string;
	phone: string;
	date: string;
	status: "Active" | "Inactive";
};

export const customerUserColumns: BaseColumnSchema<CustomerUserData>[] = [
	// ... existing columns (Name, Email, Phone, Activity, Date, Status) ...
	{
		key: "name",
		header: "Name",
		render: (row) => (
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<Icon icon="ph:circle-fill" className="text-secondary size-2" />
					<span className="text-foreground text-sm font-semibold">{row.name}</span>
				</div>
				<div className="ml-4 mt-0.5 flex items-center gap-1">
					<span className="text-muted-foreground text-[10px]">Customer ID Number:</span>
					<span className="border-border bg-muted/20 rounded border px-1.5 py-0.5 text-[10px]">
						{row.customerId}
					</span>
				</div>
			</div>
		),
	},
	{
		key: "email",
		header: "Email",
		render: (row) => <span className="text-foreground text-sm">{row.email}</span>,
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
		key: "status",
		header: "Status",
		render: (row) => (
			<Badge 
				className={cn(
					"rounded-full border-none px-3 py-1 font-medium shadow-none",
					row.status === "Active" 
						? "bg-secondary/10 text-secondary hover:bg-secondary/20" 
						: "bg-destructive/10 text-destructive hover:bg-destructive/20"
				)}
			>
				<Icon icon="ph:circle-fill" className="mr-2 size-2" />
				{row.status}
			</Badge>
		),
	},
	// UPDATED ACTION COLUMN
	{
		key: "action",
		header: "",
		render: (row) => <UserActionCell userType="customer" rowId={row.id} />,
	},
];
