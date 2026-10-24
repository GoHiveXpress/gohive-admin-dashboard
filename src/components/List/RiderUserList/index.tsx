"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/Tables";
import TablePagination from "@/components/Tables/Pagination";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { riderUserColumns, type RiderUserData } from "@/components/Tables/columns/RiderUserColumns";
import { useRiders } from "@/hooks/riderManagement";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const PAGE_SIZE = 20;

export default function RiderUserList() {
	const [page, setPage] = useState(1);
	const {
		data: response,
		isLoading,
		isFetching,
	} = useRiders({ page, limit: PAGE_SIZE }, { keepPrevious: true });
	const riders = response?.data ?? [];

	const tableData: RiderUserData[] = riders.map((r) => ({
		id: r._id,
		riderName: r.name,
		riderId: r._id.slice(-8).toUpperCase(), // No separate rider ID on the backend
		vehicleType: r.riderProfile?.vehicleType || "N/A",
		phone: r.phone,
		date: format(new Date(r.createdAt), "dd MMM yyyy | hh:mm a"),
		rating: 0, // Backend doesn't provide rating here yet
		status:
			r.accountStatus !== "Suspend" && r.riderProfile?.availabilityStatus === "online"
				? "Active"
				: "Offline",
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
			<TablePagination
				pagination={response?.pagination}
				onPageChange={setPage}
				isFetching={isFetching}
				itemLabel="riders"
			/>
		</div>
	);
}
