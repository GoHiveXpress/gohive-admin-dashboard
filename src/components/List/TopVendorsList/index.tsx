"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { DataTable } from "@/components/Tables";
import {
	vendorsColumnConfig,
	type VendorData,
} from "@/components/Tables/columns/VendorsColumnsConfig";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

// Mock Data matching the screenshot
const mockData: VendorData[] = [
	{
		rank: 1,
		name: "Mama's Kitchen",
		image: "",
		location: "No 16, station road, Offa",
		category: "Food",
		totalOrder: 1230,
		avgRating: 5.0,
		deliveryTime: "28 min",
		revenue: "₦3.4M",
		trend: "improving",
	},
	{
		rank: 2,
		name: "Mama's Kitchen",
		image: "",
		location: "No 16, station road, Offa",
		category: "Food",
		totalOrder: 1110,
		avgRating: 4.2,
		deliveryTime: "30 min",
		revenue: "₦2.4M",
		trend: "stable",
	},
	{
		rank: 3,
		name: "Mama's Kitchen",
		image: "",
		location: "No 16, station road, Offa",
		category: "Medication",
		totalOrder: 906,
		avgRating: 4.1,
		deliveryTime: "32 min",
		revenue: "₦900,500",
		trend: "declining",
	},
	{
		rank: 4,
		name: "Mama's Kitchen",
		image: "",
		location: "No 16, station road, Offa",
		category: "Grocery",
		totalOrder: 872,
		avgRating: 4.0,
		deliveryTime: "24 min",
		revenue: "₦800,000",
		trend: "improving",
	},
];

export default function TopVendorsList() {
	const columns = getColumns(vendorsColumnConfig);

	return (
		<div className="w-full">
			<div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h2 className="text-foreground text-xl font-bold">Top Vendors</h2>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						className="border-border size-9 bg-white p-0"
					>
						<Icon icon="ph:sliders-horizontal" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="bg-primary text-foreground hover:bg-primary/90 h-9 border-none"
					>
						All
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="border-border h-9 min-w-[90px] justify-between bg-white"
					>
						Region <Icon icon="ph:caret-down" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="border-border h-9 min-w-[100px] justify-between bg-white"
					>
						Categories <Icon icon="ph:caret-down" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="border-border h-9 min-w-[90px] justify-between bg-white"
					>
						Trends <Icon icon="ph:caret-down" />
					</Button>
				</div>
			</div>

			<DataTable columns={columns} data={mockData} />
		</div>
	);
}

/* eslint-enable */
