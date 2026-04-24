// src/components/Vendor/index.tsx

"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { useAdminProfile } from "@/hooks/userManagement";
import VendorManagementTabs from "./VendorManagementTabs";
import OrderOversightTabs from "./OrderOversighTabs";
import VendorCategoriesTab from "./VendorCategoriesTab";

export default function VendorIndex() {
	const { data: profileData } = useAdminProfile();
	const user = profileData?.data;
	const isSuperAdmin = user?.role === "superadmin";

	const [activeTab, setActiveTab] = useState("vendor_management");

	const tabItems: TabItem[] = [
		{ id: "vendor_management", label: "Vendor Management" },
		{ id: "order_oversight", label: "Order Oversight" },
		...(isSuperAdmin ? [{ id: "vendor_categories", label: "Vendor Categories" }] : []),
	];

	return (
		<div className="w-full space-y-6">
			{/* Header Section */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Icon icon="ph:storefront" className="text-secondary size-8" />
					<h1 className="text-foreground text-2xl font-bold">Vendor Management</h1>
				</div>

				<Button className="hidden h-10 rounded-lg px-4 font-medium text-white opacity-0">
					<Icon icon="ph:flag-banner-fill" className="mr-2 size-5" />
					View Flagged Reports
				</Button>
			</div>

			{/* Main Content Card */}
			<div className="border-border/50 min-h-[600px] rounded-[20px] border bg-white p-6 shadow-sm">
				{/* Tab Switcher */}

				<div className="bg-muted/30 mb-8 w-fit rounded-full p-1.5">
					<CustomTabs
						items={tabItems}
						activeTab={activeTab}
						onTabChange={setActiveTab}
						// If you want to force the green active state seen in screenshot
						// instead of your global primary yellow:
						className="[&_button[data-state=active]]:bg-secondary"
					/>
				</div>

				{/* Tab Content */}
				{activeTab === "vendor_management" && <VendorManagementTabs />}
				{activeTab === "order_oversight" && <OrderOversightTabs />}
				{activeTab === "vendor_categories" && isSuperAdmin && <VendorCategoriesTab />}
			</div>
		</div>
	);
}
