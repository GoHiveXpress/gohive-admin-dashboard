"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	roleSettingsColumns,
	type RoleSettingsData,
} from "@/components/Tables/columns/RoleSettingsColumns";

const MOCK_DATA: RoleSettingsData[] = [
	{
		id: "1",
		name: "Victor Kenny",
		adminId: "AGHV0923",
		status: "Active",
		phone: "09056113019",
		role: "Super Admin",
	},
	{
		id: "2",
		name: "Victor Kenny",
		adminId: "AGHV0923",
		status: "Suspend",
		phone: "09056113019",
		role: "Super Admin",
	},
	{
		id: "3",
		name: "Victor Kenny",
		adminId: "AGHV0923",
		status: "Inactive",
		phone: "09056113019",
		role: "Super Admin",
	},
	{
		id: "4",
		name: "Victor Kenny",
		adminId: "AGHV0923",
		status: "Active",
		phone: "09056113019",
		role: "Super Admin",
	},
];

export default function RoleSettingsList() {
	return (
		<div className="space-y-6">
			{/* Controls */}
			<div className="flex flex-wrap items-center gap-4">
				<Button className="bg-secondary hover:bg-secondary/90 h-10 gap-2 rounded-lg px-4 text-white">
					<Icon icon="lucide:plus-circle" className="size-5" />
					Add New Admin
				</Button>

				<div className="flex-1" />

				<div className="relative w-full sm:w-[250px]">
					<Icon
						icon="lucide:search"
						className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
					/>
					<Input
						placeholder="Search"
						className="border-border h-10 rounded-lg bg-white pl-9"
					/>
				</div>

				<Button
					variant="outline"
					size="icon"
					className="border-border size-10 rounded-lg bg-white"
				>
					<Icon icon="lucide:sliders-horizontal" className="size-4" />
				</Button>

				<Button className="bg-accent hover:bg-accent/90 h-10 rounded-lg px-6 text-white">
					All
				</Button>

				<Button
					variant="outline"
					className="border-border h-10 rounded-lg bg-white px-4 text-sm font-medium"
				>
					A-Z
				</Button>

				<Button
					variant="outline"
					className="border-border flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium"
				>
					Status <Icon icon="lucide:chevron-down" className="size-4" />
				</Button>
			</div>

			<div className="border-border overflow-hidden rounded-[20px] border bg-white p-0 shadow-sm">
				<DataTable columns={getColumns(roleSettingsColumns)} data={MOCK_DATA} />
			</div>
		</div>
	);
}
