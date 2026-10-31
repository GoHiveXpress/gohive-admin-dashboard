// src/app/(gatedPages)/report-analytics/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import ReportsAnalytics from "@/components/ReportsAnalyticst";

export default function ReportAnalyticsClient() {
	return (
		<RouteWrapper>
			<ReportsAnalytics />
		</RouteWrapper>
	);
}
