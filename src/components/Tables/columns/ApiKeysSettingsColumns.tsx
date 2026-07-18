"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { type BaseColumnSchema } from "../types";

export type ApiKeyData = {
	_id: string;
	description: string;
	apiKey: string;
	timestamp: string | Date;
	status: "Active" | "Inactive";
};

export const getApiKeysSettingsColumns = (
	onToggleStatus: (row: ApiKeyData) => void,
	onDelete: (row: ApiKeyData) => void,
): BaseColumnSchema<ApiKeyData>[] => [
	{
		key: "description",
		header: "Description",
		render: (row) => (
			<span className="text-foreground text-sm font-medium">{row.description}</span>
		),
	},
	{
		key: "apiKey",
		header: "API Key",
		render: (row) => (
			<span className="cursor-pointer text-sm text-[#3B82F6] hover:underline">{row.apiKey}</span>
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
					title={row.status === "Active" ? "Deactivate key" : "Activate key"}
				>
					<Icon icon={row.status === "Active" ? "lucide:pause" : "lucide:play"} className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onDelete(row)}
					className="text-destructive size-8"
					title="Delete key"
				>
					<Icon icon="lucide:trash-2" className="size-4" />
				</Button>
			</div>
		),
	},
];
