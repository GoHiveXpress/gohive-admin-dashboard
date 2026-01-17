"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import CustomerOrderVolumeReport from "@/components/_widgets/CustomerOrderVolumeReport";
import CustomerComparisonWidget from "@/components/_widgets/CustomerComparisonWidget";
import CustomerRetentionReport from "@/components/_widgets/CustomerRetentionReport";

export default function CustomerReportTab() {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
            <div className="lg:col-span-8 h-full">
                <CustomerOrderVolumeReport />
            </div>
            <div className="lg:col-span-4 h-full">
                <CustomerComparisonWidget />
            </div>
        </div>

        <div>
             <Button className="bg-secondary hover:bg-secondary/90 text-white h-10 px-6 rounded-lg flex items-center gap-2 mb-6">
                <Icon icon="lucide:download" /> Export
             </Button>
            <CustomerRetentionReport />
            <Button className="bg-secondary hover:bg-secondary/90 text-white h-10 px-6 rounded-lg flex items-center gap-2 mt-6">
                <Icon icon="lucide:download" /> Export
             </Button>
        </div>
    </div>
  );
}