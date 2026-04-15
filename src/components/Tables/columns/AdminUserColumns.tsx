"use client";

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import UserActionCell from "@/components/Tables/cells/UserActionCell"; // Import the cell
import { type BaseColumnSchema } from "../types";

export type AdminUserData = {
	id: string;
	name: string;
	adminId: string;
	role: string;
	activityType: string;
	date: string;
	status: "Active" | "Inactive";
};

export const adminUserColumns: BaseColumnSchema<AdminUserData>[] = [
	// ... existing columns ...
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
					<span className="text-muted-foreground text-[10px]">Admin ID Number:</span>
					<span className="border-border bg-muted/20 rounded border px-1.5 py-0.5 text-[10px]">
						{row.adminId}
					</span>
				</div>
			</div>
		),
	},
	{
		key: "role",
		header: "Role",
		render: (row) => <span className="text-foreground text-sm">{row.role}</span>,
	},
	{
		key: "activityType",
		header: "Activity Type",
		render: (row) => (
			<span className="text-muted-foreground text-sm font-medium">{row.activityType}</span>
		),
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
			<Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full border-none px-3 py-1 font-medium shadow-none">
				<Icon icon="ph:circle-fill" className="mr-2 size-2" />
				{row.status}
			</Badge>
		),
	},
	// UPDATED ACTION COLUMN
	{
		key: "action",
		header: "",
		render: (row) => <UserActionCell userType="admin" rowId={row.id} />,
	},
];
