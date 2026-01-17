"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import VendorPayoutTodayTab from "./TodayTab";
import VendorPayoutWeeklyTab from "./WeeklyTab";
import VendorPayoutMonthlyTab from "./MonthlyTab";

export default function VendorPayoutTab() {
  const [activeSubTab, setActiveSubTab] = useState<"Today" | "Weekly" | "Monthly">("Today");

  return (
    <div className="space-y-6">
      {/* Sub Tabs Heading */}
      <div>
         <h2 className="text-xl font-medium mb-3">Earning/Payout Report</h2>
         <div className="bg-muted rounded-full p-1 inline-flex">
            {(["Today", "Weekly", "Monthly"] as const).map((tab) => (
               <Button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  variant="ghost"
                  className={`rounded-full px-6 h-9 text-sm font-medium transition-all ${
                     activeSubTab === tab 
                     ? "bg-secondary text-white hover:bg-secondary/90 shadow-sm" 
                     : "text-foreground hover:bg-background/50"
                  }`}
               >
                  {tab}
               </Button>
            ))}
         </div>
      </div>

      {/* Content */}
      {activeSubTab === "Today" && <VendorPayoutTodayTab />}
      {activeSubTab === "Weekly" && <VendorPayoutWeeklyTab />}
      {activeSubTab === "Monthly" && <VendorPayoutMonthlyTab />}
    </div>
  );
}