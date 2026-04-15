"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	customerUserColumns,
	type CustomerUserData,
} from "@/components/Tables/columns/CustomerUserColumns";

const MOCK_DATA: CustomerUserData[] = [
	{
		id: "1",
		name: "Victor Kenny",
		customerId: "RGHV0923",
		email: "designbyprose@gmail.com",
		phone: "09056113019",
		activityType: "Reset Password",
		date: "12 Dec 2025 | 11:43 AM",
		status: "Active",
	},
];

export default function CustomerUserList() {
	return (
		<div className="border-border/50 w-full rounded-[20px] border bg-white pt-6 shadow-sm">
			<DataTable columns={getColumns(customerUserColumns)} data={MOCK_DATA} />
		</div>
	);
}
