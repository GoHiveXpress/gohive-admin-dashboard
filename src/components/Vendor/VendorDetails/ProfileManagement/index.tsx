// src/components/Vendor/VendorDetails/ProfileManagement/index.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type VendorUser } from "@/types/vendorManagement";
import BusinessProfile from "./BusinessProfile";
import OwnersProfile from "./OwnersProfile";
import StaffProfile from "./StaffProfile";

// Sub-tabs for the Profile Section
const PROFILE_SUB_TABS = ["Business Profile", "Owners Profile", "Staff Profile"];

interface ProfileManagementTabProps {
	vendor: VendorUser;
}

export default function ProfileManagementTab({ vendor }: ProfileManagementTabProps) {
	const [activeSubTab, setActiveSubTab] = useState("Business Profile");

	return (
		<div className="border-border/50 min-h-[600px] rounded-[20px] border bg-white p-6 shadow-sm">
			{/* Header / Sub Tabs */}
			<div className="border-border/40 mb-8 flex flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
				{/* Tab Pills */}
				<div className="bg-muted/20 flex items-center gap-1 rounded-full p-1">
					{PROFILE_SUB_TABS.map((tab) => (
						<Button
							key={tab}
							onClick={() => setActiveSubTab(tab)}
							variant="ghost"
							className={`h-10 rounded-full px-6 text-sm font-medium transition-all duration-200 ${
								activeSubTab === tab
									? "bg-[#123614] text-white shadow-md hover:bg-[#123614]/90"
									: "text-muted-foreground hover:text-foreground hover:bg-white"
							}`}
						>
							{tab}
						</Button>
					))}
				</div>

				{/* Save Changes Button (Only show for Business and Owners) */}
				{activeSubTab !== "Staff Profile" && (
					<Button className="bg-secondary hover:bg-secondary/90 h-10 rounded-full px-8 font-medium text-white">
						Save Changes
					</Button>
				)}
			</div>

			{/* Content Render */}
			<div className="animate-in fade-in zoom-in-95 duration-200">
				{activeSubTab === "Business Profile" && <BusinessProfile vendor={vendor} />}
				{activeSubTab === "Owners Profile" && <OwnersProfile vendor={vendor} />}
				{activeSubTab === "Staff Profile" && <StaffProfile />}
			</div>
		</div>
	);
}
