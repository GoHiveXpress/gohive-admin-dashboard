"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomTabs, { TabItem } from "@/components/Tabs";
import { Switch } from "@/components/ui/switch";
import ProfileManagementTab from "./ProfileManagement";
import MenuManagementTab from "./MenuManagement";
import KycVerificationTab from "./KycVerification"; 
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface VendorDetailsProps {
    vendorId: string;
}

const TAB_ITEMS: TabItem[] = [
    { id: "profile_management", label: "Profile Management" },
    { id: "menu_management", label: "Menu Management" },
    { id: "kyc_verification", label: "KYC Verification" },
];

export default function VendorDetailsIndex({ vendorId }: VendorDetailsProps) {
    const [activeTab, setActiveTab] = useState("profile_management");
    const [isActive, setIsActive] = useState(true);

    return (
        <div className="w-full space-y-6">
            {/* Header / Banner Card */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-border/50 relative">
               <Link href={ROUTES.VENDORS}>
                 <Button 
                    variant="ghost" 
                    className="absolute top-4 right-4"
                >
                   <Icon icon="ph:arrow-u-up-left-bold" width="20" />
                </Button>
               </Link>
              
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-[#E8E6D9] flex items-center justify-center text-[#8E8B7B]">
                        {/* Placeholder for Vendor Logo */}
                        <div className="w-20 h-20 rounded-full bg-[#D9D7C8]" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-foreground">Item7 Go</h1>
                            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border">
                                Vendor I.D Number : VGHV0923
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-secondary' : 'bg-muted'}`} />
                             <span className="text-sm font-medium text-secondary">Active</span>
                        </div>
                    </div>
                    
                    {/* Global Active Toggle */}
                    <div className="md:ml-auto flex items-center gap-2">
                        <span className={`text-sm font-medium ${isActive ? 'text-secondary' : 'text-muted-foreground'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Switch 
                            checked={isActive}
                            onCheckedChange={setIsActive}
                            className="data-[state=checked]:bg-secondary"
                        />
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="mt-8 bg-muted/30 p-1.5 rounded-full w-fit">
                    <CustomTabs
                        items={TAB_ITEMS}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        className="[&_button[data-state=active]]:bg-secondary [&_button[data-state=active]]:text-white" 
                    />
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === "profile_management" && <ProfileManagementTab />}
                {activeTab === "menu_management" && <MenuManagementTab />}
                {activeTab === "kyc_verification" && <KycVerificationTab />}
            </div>
        </div>
    );
}