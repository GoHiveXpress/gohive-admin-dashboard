"use client";

import React from "react";
import RiderEfficiencyReport from "@/components/_widgets/RiderEfficiencyReport";
import RiderLeaderboardList from "@/components/List/RiderLeaderboardList";
import { type ReportPeriod, periodParams } from "@/lib/reportPeriod";

export default function RiderReportTab({ period }: { period: ReportPeriod }) {
	const [extra, setExtra] = React.useState<Record<string, string>>({
		location: "",
		category: "",
	});
	const filters = { ...periodParams(period), ...extra };

	const updateFilter = (key: string, value: string) => {
		setExtra((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className="space-y-8">
			<RiderEfficiencyReport filters={filters} />
			<RiderLeaderboardList filters={filters} onFilterChange={updateFilter} />
		</div>
	);
}
