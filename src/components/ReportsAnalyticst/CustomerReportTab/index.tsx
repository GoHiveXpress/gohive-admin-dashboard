"use client";

import React from "react";
import TableExport from "@/components/_atoms/TableExport";
import { useCustomerAnalytics } from "@/hooks/analytics";
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

	// Same query as the widgets below, so this reads from the cache
	const { data } = useCustomerAnalytics(filters);
	const volumeData: Record<string, unknown>[] = data?.data?.volumeData || [];
	const retentionData: Record<string, unknown>[] = data?.data?.retentionData || [];
	const volumeColumns = [
		{ header: "Date", key: "name" },
		...Array.from(new Set(volumeData.flatMap((row) => Object.keys(row))))
			.filter((key) => key !== "name" && key !== "sortDate")
			.map((key) => ({ header: key, key })),
	];

	return (
		<div className="space-y-6">
			<div className="grid h-[400px] grid-cols-1 gap-6 lg:grid-cols-12">
				<div className="h-full lg:col-span-8">
					<CustomerOrderVolumeReport filters={filters} onFilterChange={updateFilter} />
				</div>
				<div className="h-full lg:col-span-4">
					<CustomerComparisonWidget
						value={filters.compareWith}
						onChange={(val) => updateFilter("compareWith", val)}
					/>
				</div>
			</div>

			<div>
				<div className="mb-6 flex items-center gap-3">
					<span className="text-muted-foreground text-sm">Export order volume</span>
					<TableExport
						data={volumeData}
						columns={volumeColumns}
						filename={`Order_Volume_${filters.range}`}
						title="Orders Volume"
					/>
				</div>
				<CustomerRetentionReport filters={filters} onFilterChange={updateFilter} />
				<div className="mt-6 flex items-center gap-3">
					<span className="text-muted-foreground text-sm">Export retention</span>
					<TableExport
						data={retentionData}
						columns={[
							{ header: "Date", key: "fullDate" },
							{ header: "Active customers", key: "value" },
						]}
						filename={`Customer_Retention_${filters.range}`}
						title="Active customers per day"
					/>
				</div>
			</div>
		</div>
	);
}
