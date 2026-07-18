// src/components/Vendor/VendorDetails/ProfileManagement/index.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type VendorUser } from "@/types/vendorManagement";
import BusinessProfile from "./BusinessProfile";
import OwnersProfile from "./OwnersProfile";
import StaffProfile from "./StaffProfile";
import CustomTabs from "@/components/Tabs";

// Sub-tabs for the Profile Section
const PROFILE_SUB_TABS = [
	{ id: "Business Profile", label: "Business Profile" },
	{ id: "Owners Profile", label: "Owners Profile" },
	{ id: "Staff Profile", label: "Staff Profile" },
];

interface ProfileManagementTabProps {
	vendor: VendorUser;
	vendorId: string;
}

export default function ProfileManagementTab({ vendor, vendorId }: ProfileManagementTabProps) {
	const [activeSubTab, setActiveSubTab] = useState("Business Profile");

	return (
		<div className="border-border/50 min-h-[600px] rounded-[20px] border bg-white p-6 shadow-sm">
			{/* Header / Sub Tabs */}
			<div className="border-border/40 mb-8 flex flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
				<div className="bg-muted/30 flex w-full max-w-full items-center overflow-hidden rounded-[2rem] p-1.5 sm:w-fit">
					<CustomTabs
						items={PROFILE_SUB_TABS}
						activeTab={activeSubTab}
						onTabChange={setActiveSubTab}
					/>
				</div>
			</div>

			{/* Content Render */}
			<div className="animate-in fade-in zoom-in-95 duration-200">
				{activeSubTab === "Business Profile" && <BusinessProfile vendor={vendor} />}
				{activeSubTab === "Owners Profile" && <OwnersProfile vendor={vendor} />}
				{activeSubTab === "Staff Profile" && <StaffProfile vendorId={vendorId} />}
			</div>
		</div>
	);
}
