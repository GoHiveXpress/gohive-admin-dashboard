"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CustomerComparisonWidget() {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border h-full">
      <h3 className="text-lg font-medium mb-4">Select comparison type</h3>
      <div className="relative">
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