"use client";

import React, { useState } from "react";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import LiveChatTab from "./LiveChatTab";
import TicketTab from "./TicketTab";
import BroadcastTab from "./BroadcastTab";
import CampaignTab from "./CampaignTab";

const TABS: TabItem[] = [
	{ id: "live-chat", label: "Live Chat" },
	{ id: "tickets", label: "Support Tickets" },
	{ id: "broadcasts", label: "Broadcasts" },
	{ id: "campaigns", label: "Campaigns" },
];

export default function SupportManagement() {
	const [activeTab, setActiveTab] = useState("live-chat");

	return (
		// We use h-full and flex-col to ensure it fills the RouteWrapper's children slot
		<div className="flex size-full flex-col gap-6">
			{/* Tabs Container - Muted background pill */}
			<div className="bg-muted/50 w-fit rounded-full p-1">
				<CustomTabs
					items={TABS}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					className="bg-transparent"
				/>
			</div>

			{/* Tab Content Area - flex-1 allows it to take remaining height */}
			<div className="min-h-0 flex-1">
				{activeTab === "live-chat" && <LiveChatTab />}
				{activeTab === "tickets" && <TicketTab />}
				{activeTab === "broadcasts" && <BroadcastTab />}
				{activeTab === "campaigns" && <CampaignTab />}
			</div>
		</div>
	);
}
