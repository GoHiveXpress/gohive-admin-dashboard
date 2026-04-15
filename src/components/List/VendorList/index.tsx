// src/components/List/VendorList/index.tsx
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	vendorColumnsConfig,
	type VendorData,
} from "@/components/Tables/columns/VendorManagementColumns";
import { useVendors } from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";

export default function VendorList() {
	const { data, isLoading } = useVendors();

	// Map backend data to table format
	const vendorTableData: VendorData[] =
		data?.data?.map((vendor) => ({
			id: vendor._id,
			name: vendor.vendorProfile?.businessName || vendor.name, // Prefer Business Name
			email: vendor.email,
			phone: vendor.phone || "N/A",
			// Logic: Verified email = Active status for now (customize as needed)
			status: vendor.vendorProfile?.isApproved ? "Active" : "Inactive",
			// Logic: Approved profile = Verified KYC
			kyc: vendor.vendorProfile?.isApproved ? "Verified" : "Unverified",
			rating: 0.0, // Backend doesn't provide rating yet, defaulting to 0
		})) || [];

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
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

				{/* All (Active Filter) */}
				<Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg px-6 font-medium">
					All
				</Button>

				{/* A-Z */}
				<Button
					variant="outline"
					className="border-border h-12 rounded-lg bg-white px-6 font-medium"
				>
					A-Z
				</Button>

				{/* Status Dropdown */}
				<Button
					variant="outline"
					className="border-border h-12 min-w-[120px] justify-between rounded-lg bg-white px-6 font-medium"
				>
					status <Icon icon="ph:caret-down" className="ml-2" />
				</Button>

				{/* Location Dropdown */}
				<Button
					variant="outline"
					className="border-border h-12 min-w-[130px] justify-between rounded-lg bg-white px-6 font-medium"
				>
					Location <Icon icon="ph:caret-down" className="ml-2" />
				</Button>
			</div>

			{/* Table */}
			<DataTable columns={getColumns(vendorColumnsConfig)} data={vendorTableData} title="" />
		</div>
	);
}

/* eslint-enable */
