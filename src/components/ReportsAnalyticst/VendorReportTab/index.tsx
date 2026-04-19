"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import VendorPerformanceReport from "@/components/_widgets/VendorPerformanceReport";
import VendorLeaderboardList from "@/components/List/VendorLeaderboardList";

export default function VendorReportTab() {
	const [filters, setFilters] = React.useState({
		range: "monthly",
		location: "",
		category: "",
	});

	const updateFilter = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className="space-y-6">
			<VendorPerformanceReport filters={filters} onFilterChange={updateFilter} />
			<VendorLeaderboardList filters={filters} onFilterChange={updateFilter} />
		</div>
	);
}

/* eslint-enable */
