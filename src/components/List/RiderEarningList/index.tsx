"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	riderEarningColumnsConfig,
	type RiderEarningData,
} from "@/components/Tables/columns/RiderEarningColumns";

const MOCK_DATA: RiderEarningData[] = [
	{
		id: "1",
		name: "James James",
		riderId: "VGHV0923",
		completedTrips: 230,
		earnings: "₦300.000",
		payout: "₦200.000",
		incentives: "₦1000",
		totalBalance: "₦91.000",
	},
];

export default function RiderEarningList() {
	return (
		<div className="border-border w-full rounded-[20px] border bg-white p-6 shadow-sm">
			{/* Header / Filter Row */}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				<div className="relative w-full sm:w-[300px]">
					<Icon
						icon="lucide:search"
						className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
					/>
					<Input
						placeholder="Search"
						className="border-border h-10 rounded-lg bg-transparent pl-9"
					/>
				</div>

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

				<Button
					variant="outline"
					className="border-border flex h-10 items-center gap-2 rounded-lg bg-transparent px-4 text-sm font-medium"
				>
					sort by <Icon icon="lucide:chevron-down" className="size-4" />
				</Button>
			</div>

			{/* Table */}
			<div className="-mx-6">
				<DataTable columns={getColumns(riderEarningColumnsConfig)} data={MOCK_DATA} />
			</div>

			{/* Footer */}
			<div className="border-border mt-8 border-t pt-6">
				<div className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
					<Icon icon="lucide:download" className="size-4" />
					Download Report
				</div>
				<div className="flex gap-3">
					<Button className="bg-secondary hover:bg-secondary/90 w-20 text-white">
						PDF
					</Button>
					<Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-20">
						CVS
					</Button>
				</div>
			</div>
		</div>
	);
}
