//src/components/Vendor/VendorDetails/ProfileManagement/index.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import BusinessProfile from "./BusinessProfile";
import OwnersProfile from "./OwnersProfile";
import StaffProfile from "./StaffProfile";
import { VendorUser } from "@/types/vendorManagement";

// Sub-tabs for the Profile Section
const PROFILE_SUB_TABS = ["Business Profile", "Owners Profile", "Staff Profile"];

interface ProfileManagementTabProps {
    vendor: VendorUser;
}

export default function ProfileManagementTab({ vendor }: ProfileManagementTabProps) {
    const [activeSubTab, setActiveSubTab] = useState("Business Profile");

    return (
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-border/50 min-h-[600px]">
            {/* Header / Sub Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6 mb-8">
                
                {/* Tab Pills */}
                <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-full">
                    {PROFILE_SUB_TABS.map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => setActiveSubTab(tab)}
                            variant="ghost"
                            className={`rounded-full px-6 h-10 text-sm font-medium transition-all duration-200 ${
                                activeSubTab === tab 
                                ? "bg-[#123614] text-white hover:bg-[#123614]/90 shadow-md" 
                                : "text-muted-foreground hover:bg-white hover:text-foreground"
                            }`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
                
                {/* Save Changes Button (Only show for Business and Owners) */}
                {activeSubTab !== "Staff Profile" && (
                    <Button className="bg-secondary text-white hover:bg-secondary/90 rounded-full h-10 px-8 font-medium">
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