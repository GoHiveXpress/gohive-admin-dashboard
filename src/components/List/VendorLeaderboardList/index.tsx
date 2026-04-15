"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	vendorLeaderboardColumns,
	type VendorLeaderboardData,
} from "@/components/Tables/columns/VendorLeaderboardColumns";

const MOCK_DATA: VendorLeaderboardData[] = [
	{
		id: "1",
		rank: 1,
		vendorName: "Mama's Kitchen",
		location: "No 16, station road, Offa Kwara State",
		category: "Food",
		totalOrders: 1230,
		avgRating: 5.0,
		deliveryTime: "28 min",
		revenue: "₦3.4M",
		trend: "Improving",
	},
	{
		id: "2",
		rank: 2,
		vendorName: "Mama's Kitchen",
		location: "No 16, station road, Offa Kwara State",
		category: "Food",
		totalOrders: 1110,
		avgRating: 4.2,
		deliveryTime: "30 min",
		revenue: "₦2.4M",
		trend: "Stable",
	},
	{
		id: "3",
		rank: 3,
		vendorName: "Mama's Kitchen",
		location: "No 16, station road, Offa Kwara State",
		category: "Medication",
		totalOrders: 906,
		avgRating: 4.1,
		deliveryTime: "32 min",
		revenue: "₦900,500",
		trend: "Declining",
	},
	{
		id: "4",
		rank: 4,
		vendorName: "Mama's Kitchen",
		location: "No 16, station road, Offa Kwara State",
		category: "Grocery Store",
		totalOrders: 872,
		avgRating: 4.0,
		deliveryTime: "24 min",
		revenue: "₦800,000",
		trend: "Improving",
	},
];

export default function VendorLeaderboardList() {
	return (
		<div className="border-border w-full rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex items-center gap-2">
				<Icon icon="lucide:store" className="text-primary size-5" />
				<h3 className="text-lg font-semibold">Vendor Leaderboard</h3>
			</div>

			<div className="mb-6 flex flex-wrap items-center gap-3">
				<Button
					variant="outline"
					size="icon"
					className="border-border size-10 bg-transparent"
				>
					<Icon icon="lucide:sliders-horizontal" className="size-4" />
				</Button>
				<Button className="bg-accent hover:bg-accent/90 h-10 rounded-lg px-6 text-white">
					All
				</Button>

				{["Region", "Categories", "Trends"].map((label) => (
					<Button
						key={label}
						variant="outline"
						className="border-border flex h-10 items-center gap-2 rounded-lg bg-transparent px-4 text-sm font-medium"
					>
						{label} <Icon icon="lucide:chevron-down" className="size-4" />
					</Button>
				))}
			</div>

			<div className="-mx-6">
				<DataTable columns={getColumns(vendorLeaderboardColumns)} data={MOCK_DATA} />
			</div>

			<div className="mt-6">
				<Button className="bg-secondary hover:bg-secondary/90 flex h-10 items-center gap-2 rounded-lg px-4 text-white">
					<Icon icon="lucide:download" className="size-4" /> Export
				</Button>
			</div>
		</div>
	);
}
