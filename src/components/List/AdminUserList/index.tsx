"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { adminUserColumns, type AdminUserData } from "@/components/Tables/columns/AdminUserColumns";

const MOCK_DATA: AdminUserData[] = [
	{
		id: "1",
		name: "Victor Kenny",
		adminId: "AGHV0923",
		role: "Super Admin",
		activityType: "Add Support Admin",
		date: "12 Dec 2025 | 11:43 AM",
		status: "Active",
	},
];

export default function AdminUserList() {
	return (
		<div className="border-border/50 w-full rounded-[20px] border bg-white pt-6 shadow-sm">
			<DataTable columns={getColumns(adminUserColumns)} data={MOCK_DATA} />
		</div>
	);
}
