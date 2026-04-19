"use client";

import React from "react";
import RiderEfficiencyReport from "@/components/_widgets/RiderEfficiencyReport";
import RiderComparisonWidget from "@/components/_widgets/RiderComparisonWidget";
import RiderLeaderboardList from "@/components/List/RiderLeaderboardList";

export default function RiderReportTab() {
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
		<div className="space-y-8">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				<div className="lg:col-span-7">
					<RiderEfficiencyReport filters={filters} onFilterChange={updateFilter} />
				</div>
				<div className="lg:col-span-5">
					<RiderComparisonWidget 
						value={filters.compareWith} 
						onChange={(val) => updateFilter("compareWith", val)} 
					/>
				</div>
			</div>

			<RiderLeaderboardList filters={filters} onFilterChange={updateFilter} />
		</div>
	);
}
