"use client";

import React, { useState } from "react";
import CustomTabs, { TabItem } from "@/components/Tabs";
import { Icon } from "@iconify/react";
import VendorPayoutTab from "./VendorPayoutTab";
import RiderEarningTab from "./RiderEarningTab";
import RefundLogTab from "./RefundLogTab";

const MAIN_TABS: TabItem[] = [
	{ id: "vendor-payouts", label: "Vendor Payouts" },
	{ id: "rider-earnings", label: "Rider Earnings" },
	{ id: "refund-logs", label: "Refund Logs" },
];

export default function FinanceManagement() {
	const [activeTab, setActiveTab] = useState("vendor-payouts");

	return (
		<div className="flex flex-col h-full w-full gap-6">
			{/* Top Header Section with Icon and Title handled in Client wrapper, 
          but adding the icon here for visual consistency if needed, 
          though design shows Tabs below the main header */}
			{/* <div className="flex items-center gap-3">
				<Icon icon="lucide:truck" className="text-secondary w-8 h-8" />
				
			</div> */}

			{/* Main Tabs Navigation */}
			<div className="bg-muted/30 rounded-full p-1 w-fit">
				<CustomTabs
					items={MAIN_TABS}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					className="bg-transparent"
				/>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 min-h-0">
				{activeTab === "vendor-payouts" && <VendorPayoutTab />}
				{activeTab === "rider-earnings" && <RiderEarningTab />}
				{activeTab === "refund-logs" && <RefundLogTab />}
			</div>
		</div>
	);
}
