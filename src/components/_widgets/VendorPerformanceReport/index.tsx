"use client";

import React from "react";
import { Icon } from "@iconify/react";

const StatsItem = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
    <div className="flex flex-col">
        <span className="text-base font-medium text-foreground mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">{value}</span>
            {sub && <span className="text-lg text-foreground">{sub}</span>}
        </div>
    </div>
);

export default function VendorPerformanceReport() {
  return (
    <div className="bg-transparent mb-8">
      <div className="flex items-center gap-2 mb-6">
            <Icon icon="ph:circle-fill" className="text-primary w-4 h-4" />
            <h3 className="text-xl font-medium">Vendor Performance</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsItem label="Avg. Prep Time" value="35" sub="mins" />
          <StatsItem label="Order Completion Rate" value="87%" />
          <StatsItem label="Cancellation Rate" value="4%" />
          <StatsItem label="Customer Rating" value="76%" />
      </div>
    </div>
  );
}