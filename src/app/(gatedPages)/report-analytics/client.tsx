// src/app/(gatedPages)/report-analytics/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import ReportsAnalytics from "@/components/ReportsAnalyticst";
import { Icon } from "@iconify/react";

export default function ReportAnalyticsClient() {
	return (
		<RouteWrapper
			middleSlot={
				<div className="flex items-center gap-3">
					<Icon icon="lucide:bar-chart-2" className="text-secondary size-8" />
					<h1 className="text-foreground text-2xl font-bold">Analytics & Reports</h1>
				</div>
			}
		>
			<ReportsAnalytics />
		</RouteWrapper>
	);
}
