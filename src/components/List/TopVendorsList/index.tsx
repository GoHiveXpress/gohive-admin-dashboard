"use client";

import { useState } from "react";
import { DataTable } from "@/components/Tables";
import { vendorsColumnConfig, VendorData } from "@/components/Tables/columns/VendorsColumnsConfig";
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
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
				<h2 className="text-xl font-bold text-foreground">Top Vendors</h2>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-9 p-0 bg-white border-border"
					>
						<Icon icon="ph:sliders-horizontal" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 bg-primary text-foreground border-none hover:bg-primary/90"
					>
						All
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 bg-white border-border justify-between min-w-[90px]"
					>
						Region <Icon icon="ph:caret-down" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 bg-white border-border justify-between min-w-[100px]"
					>
						Categories <Icon icon="ph:caret-down" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 bg-white border-border justify-between min-w-[90px]"
					>
						Trends <Icon icon="ph:caret-down" />
					</Button>
				</div>
			</div>

			<DataTable columns={columns} data={mockData} />
		</div>
	);
}
