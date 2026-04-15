"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	apiKeysSettingsColumns,
	type ApiKeyData,
} from "@/components/Tables/columns/ApiKeysSettingsColumns";

const MOCK_DATA: ApiKeyData[] = [
	{
		id: "1",
		description: "Description",
		apiKey: "API Key",
		timestamp: "Jan 26, 2026",
		status: "Active",
	},
];

export default function ApiKeysSettingsList() {
	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<Button className="bg-secondary hover:bg-secondary/90 h-10 gap-2 rounded-lg px-4 text-white">
					<Icon icon="lucide:plus-circle" className="size-5" />
					Generate New Key
				</Button>
			</div>

			<div className="border-border overflow-hidden rounded-[20px] border bg-white p-0 shadow-sm">
				<DataTable columns={getColumns(apiKeysSettingsColumns)} data={MOCK_DATA} />
			</div>
		</div>
	);
}
