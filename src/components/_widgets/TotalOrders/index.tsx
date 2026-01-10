"use client";
import { Icon } from "@iconify/react";

export default function TotalOrders() {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-border/50 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div className="h-12 w-12 rounded-full border-2 border-secondary/20 flex items-center justify-center">
            <Icon icon="ph:shopping-bag-fill" className="text-secondary" width="24" />
        </div>
        <div className="bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full">
            Total Orders
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground mt-4 mb-1">1,000</h2>
        <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-destructive flex items-center gap-1">
                -15% <span className="text-muted-foreground font-normal">to last month</span>
            </span>
            <Icon icon="ph:dots-three-vertical-bold" className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}