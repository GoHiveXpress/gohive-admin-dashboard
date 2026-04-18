"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AllOrders from "./AllOrders";
import Pending from "./Pending";
import EnRoute from "./EnRoute";
import Delayed from "./Delayed";

const SUB_TABS = [
	{ id: "all_orders", label: "All Orders" },
	{ id: "pending", label: "Confirmed order" },
	{ id: "en_route", label: "Pick up order" },
	{ id: "delayed", label: "Delayed" },
];

export default function OrderFlowControlTab() {
	const [activeSubTab, setActiveSubTab] = useState("all_orders");

	return (
		<div className="space-y-6">
			{/* Sub Tabs */}
			<div className="flex flex-wrap items-center gap-2">
				{SUB_TABS.map((tab) => {
					const isActive = activeSubTab === tab.id;
					return (
						<Button
							key={tab.id}
							onClick={() => setActiveSubTab(tab.id)}
							variant="ghost"
							className={`h-10 rounded-lg px-6 text-sm font-medium transition-all ${
								isActive
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "border-border text-foreground hover:bg-accent border bg-transparent"
							}`}
						>
							{tab.label}
						</Button>
					);
				})}
			</div>

			{/* Content Area */}
			{activeSubTab === "all_orders" && <AllOrders />}
			{activeSubTab === "pending" && <Pending />}
			{activeSubTab === "en_route" && <EnRoute />}
			{activeSubTab === "delayed" && <Delayed />}
		</div>
	);
}
