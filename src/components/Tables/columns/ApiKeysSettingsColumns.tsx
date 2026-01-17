"use client";

import { BaseColumnSchema } from "../types";
import { Badge } from "@/components/ui/badge";

export type ApiKeyData = {
    id: string;
    description: string;
    apiKey: string;
    timestamp: string;
    status: "Active" | "Inactive";
};

export const apiKeysSettingsColumns: BaseColumnSchema<ApiKeyData>[] = [
    {
        key: "description",
        header: "Description",
        render: (row) => <span className="text-sm font-medium text-foreground">{row.description}</span>,
    },
    {
        key: "apiKey",
        header: "API Key",
        render: (row) => <span className="text-sm text-[#3B82F6] cursor-pointer hover:underline">{row.apiKey}</span>,
    },
    {
        key: "timestamp",
        header: "Timestamp",
        render: (row) => <span className="text-sm text-foreground">{row.timestamp}</span>,
    },
    {
        key: "status",
        header: "Status",
        render: (row) => (
            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-3 py-1 rounded-full font-medium shadow-none w-fit">
                <span className="w-2 h-2 rounded-full bg-secondary mr-2" />
                {row.status}
            </Badge>
        ),
    },
];