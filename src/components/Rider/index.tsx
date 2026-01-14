"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import CustomTabs, { TabItem } from "@/components/Tabs";
import RiderManagementTab from "./RiderManagementTab";
import OrderFlowControlTab from "./OrderFlowControlTab";

const TAB_ITEMS: TabItem[] = [
    { id: "rider_management", label: "Rider Management" },
    { id: "order_flow_control", label: "Order Flow Control" },
];

export default function RiderIndex() {
    const [activeTab, setActiveTab] = useState("rider_management");

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon icon="ph:moped" className="text-secondary w-8 h-8" />
                    <h1 className="text-2xl font-bold text-foreground">Rider Management</h1>
                </div>
                
                <Button 
                    className="bg-destructive hover:bg-destructive/90 text-white font-medium rounded-lg h-10 px-4"
                >
                    <Icon icon="ph:flag-banner-fill" className="mr-2 w-5 h-5" />
                    View Flagged Reports
                </Button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-border/50 min-h-[800px]">
                
                {/* Tab Switcher - Using Secondary (Green) for Active state per screenshot */}
                <div className="bg-muted/30 p-1.5 rounded-full w-fit mb-8">
                    <CustomTabs
                        items={TAB_ITEMS}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        className="[&_button[data-state=active]]:bg-secondary [&_button[data-state=active]]:text-white" 
                    />
                </div>

                {/* Tab Content */}
                {activeTab === "rider_management" && <RiderManagementTab />}
                {activeTab === "order_flow_control" && <OrderFlowControlTab />}
            </div>
        </div>
    );
}