"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import ProfileSettingsTab from "./ProfileSettingsTab";
import RoleSettingsTab from "./RoleSettingsTab";
import AppConfigSettingsTab from "./AppConfigSettingsTab";
import NotificationSettingsTab from "./NotificationSettingsTab";
import OthersSettingsTab from "./OthersSettingsTab";

const TABS = [
	{ id: "profile", label: "Profile" },
	{ id: "role", label: "Role Management" },
	{ id: "app-config", label: "App Configuration" },
	{ id: "notification", label: "Notification Templates" },
	{ id: "others", label: "Others" },
];

export default function SettingsMain() {
	const [activeTab, setActiveTab] = useState("profile");

	return (
		<div className="flex size-full flex-col gap-8">
			{/* 
        Main Tabs - Styling explicitly to match the Green Active State in Screenshots 
        Using bg-secondary for active state as seen in the UI.
      */}
			<div className="flex w-full flex-wrap items-center gap-1 rounded-[20px] bg-gray-50/80 p-1.5 md:w-fit">
				{TABS.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<Button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							variant="ghost"
							className={`
                        h-12 rounded-2xl px-6 text-base font-medium transition-all duration-200
                        ${
							isActive
								? "bg-secondary hover:bg-secondary/90 text-white shadow-sm"
								: "text-foreground hover:bg-accent bg-transparent"
						}
                    `}
						>
							{tab.label}
						</Button>
					);
				})}
			</div>

			{/* Content Area */}
			<div className="min-h-0 flex-1">
				{activeTab === "profile" && <ProfileSettingsTab />}
				{activeTab === "role" && <RoleSettingsTab />}
				{activeTab === "app-config" && <AppConfigSettingsTab />}
				{activeTab === "notification" && <NotificationSettingsTab />}
				{activeTab === "others" && <OthersSettingsTab />}
			</div>
		</div>
	);
}

/* eslint-enable */
