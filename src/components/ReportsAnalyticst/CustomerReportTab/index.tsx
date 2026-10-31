"use client";

import React from "react";
import TableExport from "@/components/_atoms/TableExport";
import { useCustomerAnalytics } from "@/hooks/analytics";
import CustomerOrderVolumeReport from "@/components/_widgets/CustomerOrderVolumeReport";
import CustomerRetentionReport from "@/components/_widgets/CustomerRetentionReport";
import { type ReportPeriod, periodParams, periodSlug } from "@/lib/reportPeriod";

export default function CustomerReportTab({ period }: { period: ReportPeriod }) {
	const [extra, setExtra] = React.useState<Record<string, string>>({
		location: "",
		category: "",
	});
	const filters = { ...periodParams(period), ...extra };

	const updateFilter = (key: string, value: string) => {
		setExtra((prev) => ({ ...prev, [key]: value }));
	};

	// Same query as the widgets below, so this reads from the cache
	const { data } = useCustomerAnalytics(filters);
	const volumeData: Record<string, unknown>[] = data?.data?.volumeData ?? [];
	const retentionData: Record<string, unknown>[] = data?.data?.retentionData ?? [];
	const volumeColumns = [
		{ header: "Date", key: "name" },
		...Array.from(new Set(volumeData.flatMap((row) => Object.keys(row))))
			.filter((key) => key !== "name" && key !== "sortDate")
			.map((key) => ({ header: key, key })),
	];
	const slug = periodSlug(period);

	return (
		<div className="space-y-6">
			<div className="h-[400px]">
				<CustomerOrderVolumeReport filters={filters} />
			</div>

			<div>
				<div className="mb-6 flex items-center gap-3">
					<span className="text-muted-foreground text-sm">Export order volume</span>
					<TableExport
						data={volumeData}
						columns={volumeColumns}
						filename={`Order_Volume_${slug}`}
						title="Orders Volume"
					/>
				</div>
				<CustomerRetentionReport filters={filters} />
				<div className="mt-6 flex items-center gap-3">
					<span className="text-muted-foreground text-sm">Export retention</span>
					<TableExport
						data={retentionData}
						columns={[
							{ header: "Date", key: "fullDate" },
							{ header: "Active customers", key: "value" },
						]}
						filename={`Customer_Retention_${slug}`}
						title="Active customers per day"
					/>
				</div>
			</div>
		</div>
	);
}
