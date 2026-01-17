"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomerTab from "./CustomerTab";
import VendorTab from "./VendorTab";
import RiderTab from "./RiderTab";
import AdminTab from "./AdminTab";

const TABS = [
  { id: "customer", label: "Customer" },
  { id: "vendor", label: "Vendor" },
  { id: "rider", label: "Rider" },
  { id: "admin", label: "Admin" },
];

export default function UsersManagement() {
  const [activeTab, setActiveTab] = useState("customer");

  return (
    <div className="flex flex-col h-full w-full gap-6">
      
      {/* 
        Custom Tabs Styling locally to strictly match the Green/Secondary theme 
        seen in the User Management screenshots. 
      */}
      <div className="bg-muted/30 rounded-full p-1 w-fit flex items-center gap-2">
        {TABS.map((tab) => {
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
                            : "bg-transparent text-foreground hover:bg-muted"
                    )}
                >
                    {tab.label}
                </Button>
            );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === "customer" && <CustomerTab />}
        {activeTab === "vendor" && <VendorTab />}
        {activeTab === "rider" && <RiderTab />}
        {activeTab === "admin" && <AdminTab />}
      </div>
    </div>
  );
}