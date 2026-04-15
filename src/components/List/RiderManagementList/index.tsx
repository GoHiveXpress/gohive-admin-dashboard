// src/components/List/RiderManagementList/index.tsx
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { riderColumnsConfig } from "@/components/Tables/columns/RiderManagementColumns";
import { useRiders } from "@/hooks/riderManagement";
import { type RiderUser } from "@/types/riderManagement";
import { Loader2 } from "lucide-react";

export default function RiderManagementList() {
	const { data: response, isLoading, isError } = useRiders();
	const riders = response?.data || [];

	// Map API data to the format your Table expects
	// We strictly assume riderColumnsConfig expects keys like: id, name, email, phone, status, kyc
	const formattedData = riders.map((rider: RiderUser) => ({
		id: rider._id,
		name: rider.name,
		email: rider.email,
		phone: rider.phone || "N/A",
		// Capitalize first letter for UI consistency
		status:
			rider.riderProfile.availabilityStatus.charAt(0).toUpperCase() +
			rider.riderProfile.availabilityStatus.slice(1),
		kyc:
			rider.riderProfile.verificationStatus.charAt(0).toUpperCase() +
			rider.riderProfile.verificationStatus.slice(1),
		// Default rating to 0 or 5.0 as it's not in the current RiderUser type
		rating: 5.0,
		// Pass the full object if needed for actions
		original: rider,
	}));

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return <div className="text-red-500">Failed to load riders.</div>;
	}

	return (
		<div className="space-y-6">
			{/* Filters Row */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Search Bar */}
				<div className="relative w-full sm:w-[300px]">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search"
						className="border-border h-12 rounded-lg bg-white pl-10"
					/>
				</div>

				{/* Filter Icon Button */}
				<Button variant="outline" className="border-border size-12 rounded-lg bg-white p-0">
					<Icon icon="ph:sliders-horizontal" width="20" />
				</Button>

				{/* All (Active Filter - Orange) */}
				<Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg px-6 font-medium">
					All
				</Button>

				{/* Dropdowns */}
				<Button
					variant="outline"
					className="border-border h-12 min-w-[100px] justify-between rounded-lg bg-white px-4 font-medium"
				>
					Status <Icon icon="ph:caret-down" className="ml-2" />
				</Button>
				<Button
					variant="outline"
					className="border-border h-12 min-w-[100px] justify-between rounded-lg bg-white px-4 font-medium"
				>
					KYC <Icon icon="ph:caret-down" className="ml-2" />
				</Button>
				<Button
					variant="outline"
					className="border-border h-12 min-w-[120px] justify-between rounded-lg bg-white px-4 font-medium"
				>
					Availability
				</Button>
				<Button
					variant="outline"
					className="border-border h-12 min-w-[140px] justify-between rounded-lg bg-white px-4 font-medium"
				>
					Performance Rating
				</Button>
			</div>

			{/* Table */}
			<DataTable columns={getColumns(riderColumnsConfig)} data={formattedData} title="" />
		</div>
	);
}

/* eslint-enable */
