"use client";

import React, { useState, useMemo } from "react";
import ProfileSettingsTab from "./ProfileSettingsTab";
import RoleSettingsTab from "./RoleSettingsTab";
import NotificationSettingsTab from "./NotificationSettingsTab";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const ALL_TABS = [
	{ id: "profile", label: "Profile", roles: ["superadmin", "staff"] },
	{ id: "role", label: "Role Management", roles: ["superadmin"] },
	// { id: "app-config", label: "App Configuration", roles: ["superadmin"] },
	{ id: "notification", label: "Notification Templates", roles: ["superadmin"] },
	// { id: "others", label: "Others", roles: ["superadmin"] },
];

export default function SettingsMain() {
	const { data: session } = useSession();
	const userRole = session?.user?.role || "staff";

	const filteredTabs = useMemo(() => {
		return ALL_TABS.filter((tab) => tab.roles.includes(userRole));
	}, [userRole]);

	const [activeTab, setActiveTab] = useState("profile");

	return (
		<div className="flex size-full flex-col gap-8">
			{/* Main Tabs */}
			<div className="flex w-full flex-wrap items-center gap-1 rounded-[20px] bg-gray-50/80 p-1.5 md:w-fit">
				{filteredTabs.map((tab) => {
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
				{activeTab === "role" && userRole === "superadmin" && <RoleSettingsTab />}
				{activeTab === "notification" && userRole === "superadmin" && (
					<NotificationSettingsTab />
				)}
			</div>
		</div>
	);
}

/* eslint-enable */
