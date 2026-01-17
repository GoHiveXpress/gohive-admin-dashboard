"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RiderComparisonWidget() {
  return (
    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-border h-full flex flex-col justify-start">
      <div className="flex items-center gap-2 mb-6">
            <Icon icon="ph:circle-fill" className="text-primary w-4 h-4" />
            <h3 className="text-xl font-medium">Compare Periods</h3>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-4">Select comparison type</h3>
        <Select>
                <SelectTrigger className="w-full h-14 rounded-lg border-border bg-white">
                    <SelectValue placeholder="Previous day/week/month." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="prev_day">Previous Day</SelectItem>
                    <SelectItem value="prev_week">Previous Week</SelectItem>
                    <SelectItem value="prev_month">Previous Month</SelectItem>
                </SelectContent>
        </Select>
      </div>
    </div>
  );
}