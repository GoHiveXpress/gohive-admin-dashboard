"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import CustomTabs, { TabItem } from "@/components/Tabs";
import VendorManagementTabs from "./VendorManagementTabs";
import OrderOversightTabs from "./OrderOversighTabs";

const TAB_ITEMS: TabItem[] = [
    { id: "vendor_management", label: "Vendor Management" },
    { id: "order_oversight", label: "Order Oversight" },
];

export default function VendorIndex() {
    const [activeTab, setActiveTab] = useState("vendor_management");

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon icon="ph:storefront" className="text-secondary w-8 h-8" />
                    <h1 className="text-2xl font-bold text-foreground">Vendor Management</h1>
                </div>
                
                <Button 
                    className="bg-destructive hover:bg-destructive/90 text-white font-medium rounded-lg h-10 px-4"
                >
                    <Icon icon="ph:flag-banner-fill" className="mr-2 w-5 h-5" />
                    View Flagged Reports
                </Button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-border/50 min-h-[600px]">
                
                {/* Tab Switcher */}
                {/* 
                   Note: The screenshot shows a secondary/green active state, but your global CSS 
                   defines primary as yellow. To match the screenshot visually while using your
                   CustomTabs, we allow CustomTabs to use its default behavior (Primary/Yellow)
                   OR we wrap it in a class to override if strictly needed. 
                   Below assumes standard usage of your component. 
                   To create the pill container effect seen in screenshot:
                */}
                <div className="bg-muted/30 p-1.5 rounded-full w-fit mb-8">
                    <CustomTabs
                        items={TAB_ITEMS}
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
            </div>
        </div>
    );
}