"use client";

import { Badge } from "@/components/ui/badge";
import { type BaseColumnSchema } from "../types";

export type WebhookData = {
	id: string;
	url: string;
	description: string;
	timestamp: string;
	status: "Active" | "Inactive";
};

export const webhookSettingsColumns: BaseColumnSchema<WebhookData>[] = [
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
			<span className="text-foreground text-sm font-medium">{row.description}</span>
		),
	},
	{
		key: "timestamp",
		header: "Timestamp",
		render: (row) => <span className="text-foreground text-sm">{row.timestamp}</span>,
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
];
