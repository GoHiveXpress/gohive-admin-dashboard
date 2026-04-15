"use client";

/* eslint-disable @next/next/no-img-element, no-nested-ternary */

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RoleActionCell from "@/components/Tables/cells/RoleActionCell";
import { type BaseColumnSchema } from "../types";

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
					<div className="size-10 overflow-hidden rounded-full bg-gray-200">
						<img
							src={`https://i.pravatar.cc/150?u=${row.id}`}
							alt={row.name}
							className="size-full object-cover"
						/>
					</div>
					{/* Status Dot on Avatar */}
					<span
						className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${
							row.status === "Active"
								? "bg-secondary"
								: row.status === "Suspend"
									? "bg-destructive"
									: "bg-orange-400"
						}`}
					/>
				</div>
				<div className="flex flex-col">
					<span className="text-foreground text-sm font-semibold">{row.name}</span>
					<div className="flex items-center gap-1">
						<span className="text-muted-foreground text-[10px]">Admin ID Number:</span>
						<span className="border-border bg-muted/20 rounded border px-1.5 py-0.5 text-[10px]">
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
			const text = row.status;

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
					className={`rounded-full border-none px-3 py-1 font-medium shadow-none ${badgeClass} hover:${badgeClass}`}
				>
					<Icon icon="ph:circle-fill" className={`mr-2 size-2 ${iconClass}`} />
					{text}
				</Badge>
			);
		},
	},
	{
		key: "phone",
		header: "Phone",
		render: (row) => <span className="text-foreground text-sm font-medium">{row.phone}</span>,
	},
	{
		key: "role",
		header: "Role",
		render: (row) => (
			<div className="text-secondary inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium">
				{row.role}
				<Icon icon="lucide:chevron-down" className="size-4" />
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
				className="size-9 rounded-full bg-red-50 hover:bg-red-100"
			>
				<Icon icon="lucide:trash-2" className="text-destructive size-5" />
			</Button>
		),
	},
];

/* eslint-enable */
