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

export default function RiderEfficiencyReport() {
  return (
     <div className="bg-white rounded-[20px] p-8 shadow-sm border border-border h-full">
         <div className="flex items-center gap-2 mb-6">
            <Icon icon="ph:circle-fill" className="text-primary w-4 h-4" />
            <h3 className="text-xl font-medium">Rider Efficiency</h3>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
             <button className="h-9 w-9 flex items-center justify-center border border-border rounded-md"><Icon icon="lucide:sliders-horizontal" /></button>
             {["Date", "Location", "Category"].map(label => (
                 <button key={label} className="h-9 px-3 border border-border rounded-md text-sm font-medium flex items-center gap-2 bg-transparent">
                     {label} <Icon icon="lucide:chevron-down" className="w-3 h-3" />
                 </button>
             ))}
        </div>

        <div className="grid grid-cols-2 gap-y-8 gap-x-12">
            <StatsItem label="Average Delivery Time" value="35" sub="mins" />
            <StatsItem label="Acceptance Rate" value="66%" />
            <StatsItem label="Completion Rate" value="94%" />
            <StatsItem label="On Time Deliveries" value="76%" />
        </div>
     </div>
  );
}