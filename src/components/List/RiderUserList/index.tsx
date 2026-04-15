"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { riderUserColumns, type RiderUserData } from "@/components/Tables/columns/RiderUserColumns";

const MOCK_DATA: RiderUserData[] = [
	{
		id: "1",
		riderName: "James James",
		riderId: "VGHV0923",
		vehicleType: "Bike (NFA8956)",
		phone: "09056113019",
		activityType: "Picked Order #12345",
		date: "12 Dec 2025 | 11:43 AM",
		rating: 5.0,
		status: "Offline",
	},
];

export default function RiderUserList() {
	return (
		<div className="border-border/50 w-full rounded-[20px] border bg-white pt-6 shadow-sm">
			<DataTable columns={getColumns(riderUserColumns)} data={MOCK_DATA} />
		</div>
	);
}
