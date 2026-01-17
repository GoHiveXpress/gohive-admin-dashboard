"use client";

import { BaseColumnSchema } from "../types";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RoleActionCell from "@/components/Tables/cells/RoleActionCell";

export type RoleSettingsData = {
	id: string;
	name: string;
	adminId: string;
	status: "Active" | "Suspend" | "Inactive";
	phone: string;
	role: string;
};

export const roleSettingsColumns: BaseColumnSchema<RoleSettingsData>[] = [
	{
		key: "name",
		header: "Name",
		render: (row) => (
			<div className="flex items-center gap-3">
				<div className="relative">
					<div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
						<img
							src={`https://i.pravatar.cc/150?u=${row.id}`}
							alt={row.name}
							className="w-full h-full object-cover"
						/>
					</div>
					{/* Status Dot on Avatar */}
					<span
						className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
							row.status === "Active"
								? "bg-secondary"
								: row.status === "Suspend"
									? "bg-destructive"
									: "bg-orange-400"
						}`}
					/>
				</div>
				<div className="flex flex-col">
					<span className="font-semibold text-foreground text-sm">{row.name}</span>
					<div className="flex items-center gap-1">
						<span className="text-[10px] text-muted-foreground">Admin ID Number:</span>
						<span className="text-[10px] border border-border rounded px-1.5 py-0.5 bg-muted/20">
							{row.adminId}
						</span>
					</div>
				</div>
			</div>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row) => {
			let badgeClass = "";
			let iconClass = "";
			let text = row.status;

			if (row.status === "Active") {
				badgeClass = "bg-secondary/10 text-secondary";
				iconClass = "text-secondary";
			} else if (row.status === "Suspend") {
				badgeClass = "bg-destructive/10 text-destructive";
				iconClass = "text-destructive";
			} else {
				badgeClass = "bg-orange-100 text-orange-500";
				iconClass = "text-orange-500";
			}

			return (
				<Badge
					className={`border-none px-3 py-1 rounded-full font-medium shadow-none ${badgeClass} hover:${badgeClass}`}
				>
					<Icon icon="ph:circle-fill" className={`w-2 h-2 mr-2 ${iconClass}`} />
					{text}
				</Badge>
			);
		},
	},
	{
		key: "phone",
		header: "Phone",
		render: (row) => <span className="text-sm font-medium text-foreground">{row.phone}</span>,
	},
	{
		key: "role",
		header: "Role",
		render: (row) => (
			<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-secondary text-sm font-medium">
				{row.role}
				<Icon icon="lucide:chevron-down" className="w-4 h-4" />
			</div>
		),
	},
	{
		key: "permission",
		header: "Permission",

		render: (row) => <RoleActionCell row={row} />,
	},
	{
		key: "action",
		header: "",
		render: () => (
			<Button
				variant="ghost"
				size="icon"
				className="h-9 w-9 rounded-full bg-red-50 hover:bg-red-100"
			>
				<Icon icon="lucide:trash-2" className="w-5 h-5 text-destructive" />
			</Button>
		),
	},
];
