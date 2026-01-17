"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import RiderEarningTodayTab from "./TodayTab";
import RiderEarningWeeklyTab from "./WeeklyTab";
import RiderEarningMonthlyTab from "./MonthlyTab";

export default function RiderEarningTab() {
  const [activeSubTab, setActiveSubTab] = useState<"Today" | "Weekly" | "Monthly">("Today");

  return (
    <div className="space-y-6">
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
                     : "text-foreground hover:bg-accent"
                  }`}
               >
                  {tab}
               </Button>
            ))}
         </div>
      </div>

      {activeSubTab === "Today" && <RiderEarningTodayTab />}
      {activeSubTab === "Weekly" && <RiderEarningWeeklyTab />}
      {activeSubTab === "Monthly" && <RiderEarningMonthlyTab />}
    </div>
  );
}