"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { type BaseColumnSchema } from "../types";

export type WebhookData = {
	_id: string;
	url: string;
	description: string;
	timestamp: string | Date;
	status: "Active" | "Inactive";
};

export const getWebhookSettingsColumns = (
	onToggleStatus: (row: WebhookData) => void,
	onDelete: (row: WebhookData) => void,
): BaseColumnSchema<WebhookData>[] => [
	{
		key: "url",
		header: "URL",
		render: (row) => (
			<span className="cursor-pointer text-sm text-[#3B82F6] hover:underline">{row.url}</span>
		),
	},
	{
		key: "description",
		header: "Description",
		render: (row) => (
			<span className="text-foreground text-sm font-medium">{row.description || "-"}</span>
		),
	},
	{
		key: "timestamp",
		header: "Timestamp",
		render: (row) => (
			<span className="text-foreground text-sm">
				{new Date(row.timestamp).toLocaleString()}
			</span>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row) => (
			<Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 w-fit rounded-full border-none px-3 py-1 font-medium shadow-none">
				<span className="bg-secondary mr-2 size-2 rounded-full" />
				{row.status}
			</Badge>
		),
	},
	{
		key: "action",
		header: "",
		render: (row) => (
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onToggleStatus(row)}
					className="size-8"
					title={row.status === "Active" ? "Deactivate webhook" : "Activate webhook"}
				>
					<Icon icon={row.status === "Active" ? "lucide:pause" : "lucide:play"} className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onDelete(row)}
					className="text-destructive size-8"
					title="Delete webhook"
				>
					<Icon icon="lucide:trash-2" className="size-4" />
				</Button>
			</div>
		),
	},
];
