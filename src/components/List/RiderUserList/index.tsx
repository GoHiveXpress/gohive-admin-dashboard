"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { riderUserColumns, type RiderUserData } from "@/components/Tables/columns/RiderUserColumns";
import { useRiders } from "@/hooks/userManagement";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function RiderUserList() {
	const { data: response, isLoading } = useRiders();
	const riders = response?.data || [];

	const tableData: RiderUserData[] = riders.map((r) => ({
		id: r._id,
		riderName: r.name,
		riderId: r.riderProfile?.riderId || r._id.slice(-8).toUpperCase(),
		vehicleType: r.riderProfile?.vehicleType || "N/A",
		phone: r.phone,
		date: format(new Date(r.createdAt), "dd MMM yyyy | hh:mm a"),
		rating: 0, // Backend doesn't provide rating here yet
		status: (r.accountStatus === "Suspend"
			? "Offline"
			: r.riderProfile?.availabilityStatus === "online"
				? "Active"
				: "Offline") as any,
	}));

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="border-border/50 w-full rounded-[20px] border bg-white pt-6 shadow-sm">
			<DataTable columns={getColumns(riderUserColumns)} data={tableData} />
		</div>
	);
}
