"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	vendorUserColumns,
	type VendorUserData,
} from "@/components/Tables/columns/VendorUserColumns";

const MOCK_DATA: VendorUserData[] = [
	{
		id: "1",
		storeName: "Item 7",
		vendorId: "VGHV0923",
		location: "No 5, Abuja Street",
		phone: "09056113019",
		activityType: "Added new Staff",
		date: "12 Dec 2025 | 11:43 AM",
		status: "Active",
	},
	{
		id: "2",
		storeName: "Unique",
		vendorId: "VGHV0425",
		location: "No 23, Offa Street",
		phone: "09056118888",
		activityType: "Added new Menu",
		date: "12 Dec 2025 | 2:43 PM",
		status: "Active",
	},
];

export default function VendorUserList() {
	return (
		<div className="border-border/50 w-full rounded-[20px] border bg-white pt-6 shadow-sm">
			<DataTable columns={getColumns(vendorUserColumns)} data={MOCK_DATA} />
		</div>
	);
}
