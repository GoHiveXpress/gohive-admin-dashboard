"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import VendorPerformanceReport from "@/components/_widgets/VendorPerformanceReport";
import VendorLeaderboardList from "@/components/List/VendorLeaderboardList";

export default function VendorReportTab() {
  return (
    <div>
        <VendorPerformanceReport />
        <VendorLeaderboardList />
        {/* <div className="mt-6">
            <Button className="bg-secondary hover:bg-secondary/90 text-white h-10 px-6 rounded-lg flex items-center gap-2">
                <Icon icon="lucide:download" /> Export
            </Button>
        </div> */}
    </div>
  );
}