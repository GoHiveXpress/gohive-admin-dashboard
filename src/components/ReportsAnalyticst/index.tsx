"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { Icon } from "@iconify/react";
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

	return (
		<div className="flex flex-col gap-6">
			{/* Header handled by RouteWrapper, putting visual icon here if needed or empty div */}
			{/* <div className="flex items-center gap-3">
				<Icon icon="lucide:bar-chart-2" className="text-secondary w-8 h-8" />
				
			</div> */}

			<div className="bg-muted/30 w-fit rounded-full p-1">
				<CustomTabs
					items={TABS}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					className="bg-transparent"
				/>
			</div>

			<div className="mt-2 min-h-0 flex-1">
				{activeTab === "customer" && <CustomerReportTab />}
				{activeTab === "vendor" && <VendorReportTab />}
				{activeTab === "rider" && <RiderReportTab />}
			</div>
		</div>
	);
}

/* eslint-enable */
