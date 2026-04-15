"use client";

import React from "react";
import RiderEfficiencyReport from "@/components/_widgets/RiderEfficiencyReport";
import RiderComparisonWidget from "@/components/_widgets/RiderComparisonWidget";
import RiderLeaderboardList from "@/components/List/RiderLeaderboardList";

export default function RiderReportTab() {
	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				<div className="lg:col-span-7">
					<RiderEfficiencyReport />
				</div>
				<div className="lg:col-span-5">
					<RiderComparisonWidget />
				</div>
			</div>

			<RiderLeaderboardList />
		</div>
	);
}
