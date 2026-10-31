"use client";

import React, { useState } from "react";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import ReportPeriodPicker from "@/components/_atoms/ReportPeriodPicker";
import { type ReportPeriod, defaultReportPeriod, periodError } from "@/lib/reportPeriod";
import CustomerReportTab from "./CustomerReportTab";
import VendorReportTab from "./VendorReportTab";
import RiderReportTab from "./RiderReportTab";

const TABS: TabItem[] = [
	{ id: "customer", label: "Customer" },
	{ id: "vendor", label: "Vendor" },
	{ id: "rider", label: "Rider" },
];

export default function ReportsAnalytics() {
	const [activeTab, setActiveTab] = useState("customer");
	const [period, setPeriod] = useState<ReportPeriod>(() => defaultReportPeriod());
	// The last period that made sense; half-typed custom dates don't reload the reports
	const [applied, setApplied] = useState<ReportPeriod>(period);

	const handlePeriodChange = (next: ReportPeriod) => {
		setPeriod(next);
		if (!periodError(next)) setApplied(next);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4">
				<div className="bg-muted/30 w-fit rounded-full p-1">
					<CustomTabs
						items={TABS}
						activeTab={activeTab}
						onTabChange={setActiveTab}
						className="bg-transparent"
					/>
				</div>
				<ReportPeriodPicker value={period} onChange={handlePeriodChange} />
			</div>

			<div className="min-h-0 flex-1">
				{activeTab === "customer" && <CustomerReportTab period={applied} />}
				{activeTab === "vendor" && <VendorReportTab period={applied} />}
				{activeTab === "rider" && <RiderReportTab period={applied} />}
			</div>
		</div>
	);
}
