"use client";

import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import ProfileSettingsTab from "./ProfileSettingsTab";
import RoleSettingsTab from "./RoleSettingsTab";
import NotificationSettingsTab from "./NotificationSettingsTab";
import ActivitiesTab from "./ActivitiesTab";
import AuditLogTab from "./AuditLogTab";
import OthersSettingsTab from "./OthersSettingsTab";
import AppConfigSettingsTab from "./AppConfigSettingsTab";

const ALL_TABS = [
	{ id: "profile", label: "Profile", roles: ["superadmin", "staff"] },
	{ id: "activities", label: "Activities", roles: ["superadmin", "staff"] },
	{ id: "audit-log", label: "Audit Log", roles: ["superadmin"] },
	{ id: "role", label: "Role Management", roles: ["superadmin"] },
	{ id: "app-config", label: "Delivery Fee Settings", roles: ["superadmin"] },
	{ id: "notification", label: "Notification Templates", roles: ["superadmin"] },
	{ id: "others", label: "Others", roles: ["superadmin"] },
];

export default function SettingsMain() {
	const { role } = usePermissions();
	const userRole = role ?? "staff";
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const filteredTabs = useMemo(() => {
		return ALL_TABS.filter((tab) => tab.roles.includes(userRole));
	}, [userRole]);

	// The tab lives in the URL so it survives a refresh and can be linked to.
	// A ?tab= the user may not open falls back to Profile.
	const requestedTab = searchParams.get("tab") ?? "profile";
	const activeTab = filteredTabs.some((tab) => tab.id === requestedTab)
		? requestedTab
		: "profile";

	const setActiveTab = useCallback(
		(tabId: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("tab", tabId);
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams],
	);

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
				{activeTab === "activities" && <ActivitiesTab />}
				{activeTab === "audit-log" && userRole === "superadmin" && <AuditLogTab />}
				{activeTab === "role" && userRole === "superadmin" && <RoleSettingsTab />}
				{activeTab === "app-config" && userRole === "superadmin" && (
					<AppConfigSettingsTab />
				)}
				{activeTab === "notification" && userRole === "superadmin" && (
					<NotificationSettingsTab />
				)}
				{activeTab === "others" && userRole === "superadmin" && <OthersSettingsTab />}
			</div>
		</div>
	);
}
