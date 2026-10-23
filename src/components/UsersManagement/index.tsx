"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import CustomerTab from "./CustomerTab";
import VendorTab from "./VendorTab";
import RiderTab from "./RiderTab";
import AdminTab from "./AdminTab";

// /admins is superadmin-only on the backend, so staff never see the Admin tab
// (they would only get a 403 there).
const TABS = [
	{ id: "customer", label: "Customer", superadminOnly: false },
	{ id: "vendor", label: "Vendor", superadminOnly: false },
	{ id: "rider", label: "Rider", superadminOnly: false },
	{ id: "admin", label: "Admin", superadminOnly: true },
];

export default function UsersManagement() {
	const { isSuperAdmin } = usePermissions();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const visibleTabs = TABS.filter((tab) => isSuperAdmin || !tab.superadminOnly);
	const requestedTab = searchParams.get("tab") ?? "customer";
	const activeTab = visibleTabs.some((tab) => tab.id === requestedTab)
		? requestedTab
		: "customer";

	const setActiveTab = useCallback(
		(tabId: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("tab", tabId);
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	return (
		<div className="flex size-full flex-col gap-6">
			{/* 
        Custom Tabs Styling locally to strictly match the Green/Secondary theme 
        seen in the User Management screenshots. 
      */}
			<div className="bg-muted/30 flex w-fit items-center gap-2 rounded-full p-1">
				{visibleTabs.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<Button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							variant="ghost"
							className={cn(
								"rounded-full px-8 h-12 text-base font-medium transition-all duration-200",
								isActive
									? "bg-secondary text-white hover:bg-secondary/90 shadow-sm"
									: "bg-transparent text-foreground hover:bg-accent",
							)}
						>
							{tab.label}
						</Button>
					);
				})}
			</div>

			{/* Main Content Area */}
			<div className="min-h-0 flex-1">
				{activeTab === "customer" && <CustomerTab />}
				{activeTab === "vendor" && <VendorTab />}
				{activeTab === "rider" && <RiderTab />}
				{activeTab === "admin" && isSuperAdmin && <AdminTab />}
			</div>
		</div>
	);
}
