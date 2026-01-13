"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import CustomTabs, { TabItem } from "@/components/Tabs";
import CustomerManagementTabList from "@/components/List/CustomerManagementTabList";
import OrderManagementTabList from "@/components/List/OrderManagementTabList";

const TAB_ITEMS: TabItem[] = [
    { id: "customers", label: "Customer Management" },
    { id: "orders", label: "Order Management" },
];

export default function CustomerManagementTab() {
    const [activeTab, setActiveTab] = useState("customers");

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-2">
                <Icon icon="ph:smiley-bold" className="text-secondary w-8 h-8" />
                <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
            </div>

            {/* Tabs & Content Container */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-border/50 space-y-6">
                {/* Tabs Switcher */}
                <div className="bg-muted/30 p-1.5 rounded-full w-fit">
                    <CustomTabs
                        items={TAB_ITEMS}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTab === "customers" ? (
                        <CustomerManagementTabList />
                    ) : (
                        <OrderManagementTabList />
                    )}
                </div>
            </div>
        </div>
    );
}