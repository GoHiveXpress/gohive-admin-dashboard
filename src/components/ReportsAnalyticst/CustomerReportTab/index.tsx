"use client";

import React from "react";
import { Button } from "@/components/ui/button"; 
import { Icon } from "@iconify/react";
import CustomerOrderVolumeReport from "@/components/_widgets/CustomerOrderVolumeReport";
import CustomerComparisonWidget from "@/components/_widgets/CustomerComparisonWidget";
import CustomerRetentionReport from "@/components/_widgets/CustomerRetentionReport";

export default function CustomerReportTab() {
	const [filters, setFilters] = React.useState({
		range: "monthly",
		compareWith: "",
		location: "",
		category: "",
	});

	const updateFilter = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className="space-y-6">
			<div className="grid h-[400px] grid-cols-1 gap-6 lg:grid-cols-12">
				<div className="h-full lg:col-span-8">
					<CustomerOrderVolumeReport 
						filters={filters} 
						onFilterChange={updateFilter} 
					/>
				</div>
				<div className="h-full lg:col-span-4">
					<CustomerComparisonWidget 
						value={filters.compareWith} 
						onChange={(val) => updateFilter("compareWith", val)} 
					/>
				</div>
			</div>

			<div>
				<div className="mb-6 flex items-center justify-between">
					<Button className="bg-secondary hover:bg-secondary/90 flex h-10 items-center gap-2 rounded-lg px-6 text-white">
						<Icon icon="lucide:download" /> Export
					</Button>
				</div>
				<CustomerRetentionReport filters={filters} onFilterChange={updateFilter} />
				<Button className="bg-secondary hover:bg-secondary/90 mt-6 flex h-10 items-center gap-2 rounded-lg px-6 text-white">
					<Icon icon="lucide:download" /> Export
				</Button>
			</div>
		</div>
	);
}
