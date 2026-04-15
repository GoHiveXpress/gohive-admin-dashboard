"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import VendorPayoutTodayTab from "./TodayTab";
import VendorPayoutWeeklyTab from "./WeeklyTab";
import VendorPayoutMonthlyTab from "./MonthlyTab";

export default function VendorPayoutTab() {
	const [activeSubTab, setActiveSubTab] = useState<"Today" | "Weekly" | "Monthly">("Today");

	return (
		<div className="space-y-6">
			{/* Sub Tabs Heading */}
			<div>
				<h2 className="mb-3 text-xl font-medium">Earning/Payout Report</h2>
				<div className="bg-muted inline-flex rounded-full p-1">
					{(["Today", "Weekly", "Monthly"] as const).map((tab) => (
						<Button
							key={tab}
							onClick={() => setActiveSubTab(tab)}
							variant="ghost"
							className={`h-9 rounded-full px-6 text-sm font-medium transition-all ${
								activeSubTab === tab
									? "bg-secondary hover:bg-secondary/90 text-white shadow-sm"
									: "text-foreground hover:bg-accent"
							}`}
						>
							{tab}
						</Button>
					))}
				</div>
			</div>

			{/* Content */}
			{activeSubTab === "Today" && <VendorPayoutTodayTab />}
			{activeSubTab === "Weekly" && <VendorPayoutWeeklyTab />}
			{activeSubTab === "Monthly" && <VendorPayoutMonthlyTab />}
		</div>
	);
}
