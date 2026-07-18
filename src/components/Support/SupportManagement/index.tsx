"use client";

import React, { useState } from "react";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { useSession } from "next-auth/react";
import LiveChatTab from "./LiveChatTab";
import TicketTab from "./TicketTab";
import BroadcastTab from "./BroadcastTab";
import CampaignTab from "./CampaignTab";

const TABS: (TabItem & { roles: string[] })[] = [
	{ id: "live-chat", label: "Live Chat", roles: ["superadmin", "staff"] },
	{ id: "tickets", label: "Support Tickets", roles: ["superadmin", "staff"] },
	{ id: "broadcasts", label: "Broadcasts", roles: ["superadmin"] },
	{ id: "campaigns", label: "Campaigns", roles: ["superadmin"] },
];

export default function SupportManagement() {
	const { data: session } = useSession();
	const userRole = session?.user?.role || "staff";

	const filteredTabs = TABS.filter((tab) => tab.roles.includes(userRole));
	const [activeTab, setActiveTab] = useState("live-chat");

	return (
		// We use h-full and flex-col to ensure it fills the RouteWrapper's children slot
		<div className="flex size-full flex-col gap-6 rounded-2xl border border-transparent p-1 xl:gap-8 xl:p-2">
			{/* Tabs Container - Muted background pill */}
			<div className="bg-muted/50 max-w-full overflow-x-auto rounded-full p-1">
				<CustomTabs
					items={filteredTabs}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					className="bg-transparent"
				/>
			</div>

			{/* Tab Content Area - flex-1 allows it to take remaining height */}
			<div className="min-h-0 flex-1">
				{activeTab === "live-chat" && <LiveChatTab />}
				{activeTab === "tickets" && <TicketTab />}
				{activeTab === "broadcasts" && userRole === "superadmin" && <BroadcastTab />}
				{activeTab === "campaigns" && userRole === "superadmin" && <CampaignTab />}
			</div>
		</div>
	);
}
