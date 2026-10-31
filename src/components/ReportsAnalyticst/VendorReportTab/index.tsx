"use client";

import React from "react";
import VendorPerformanceReport from "@/components/_widgets/VendorPerformanceReport";
import VendorLeaderboardList from "@/components/List/VendorLeaderboardList";
import { type ReportPeriod, periodParams } from "@/lib/reportPeriod";

export default function VendorReportTab({ period }: { period: ReportPeriod }) {
	const [extra, setExtra] = React.useState<Record<string, string>>({
		location: "",
		category: "",
	});
	const filters = { ...periodParams(period), ...extra };

	const updateFilter = (key: string, value: string) => {
		setExtra((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className="space-y-6">
			<VendorPerformanceReport filters={filters} />
			<VendorLeaderboardList filters={filters} onFilterChange={updateFilter} />
		</div>
	);
}
