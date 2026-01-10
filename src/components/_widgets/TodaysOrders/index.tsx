"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";


const stats = [
    { label: "Pending", count: 10, icon: "ph:clock-fill", color: "text-accent" },
    { label: "En route", count: 5, icon: "ph:map-pin-fill", color: "text-destructive" },
    { label: "Delayed", count: 10, icon: "ph:warning-circle-fill", color: "text-destructive" },
    { label: "Delivered", count: 10, icon: "ph:check-circle-fill", color: "text-secondary" },
];

export default function TodaysOrders() {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50 h-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Todays Orders</h3>
        <h2 className="text-3xl font-bold text-foreground">35</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side Stats */}
        <div className="w-full lg:w-[200px] flex flex-col gap-3 shrink-0">
            <div className="flex gap-2 mb-2">
                <Button variant="outline" size="sm" className="h-8 w-10 p-0">
                    <Icon icon="ph:sliders-horizontal" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs font-normal justify-between w-full">
                    Location <Icon icon="ph:caret-down" />
                </Button>
            </div>
            {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 ${stat.color}`}>
                            <Icon icon={stat.icon} width="18" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{stat.label}</span>
                    </div>
                    <span className="text-sm font-bold">{stat.count}</span>
                </div>
            ))}
        </div>

        {/* Right Side Map Placeholder */}
        <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[300px] bg-muted/30">
            <div className="absolute inset-0 bg-[#E6EBF5] flex items-center justify-center">
                <div className="text-center">
                    <Icon icon="ph:map-trifold-duotone" className="text-muted-foreground/30 mx-auto" width="64" />
                    <p className="text-muted-foreground/50 text-sm mt-2">Map View Integration</p>
                </div>
                {/* Mock Map Overlay Elements */}
                <div className="absolute top-10 right-20 bg-white/90 p-2 rounded-lg shadow-lg backdrop-blur-sm">
                    <p className="text-xs font-bold text-purple-600">Offa Descendants Union</p>
                </div>
                <Icon icon="ph:map-pin-fill" className="text-destructive absolute top-1/3 left-1/3 drop-shadow-md" width="32" />
                <Icon icon="ph:map-pin-fill" className="text-accent absolute bottom-1/3 right-1/3 drop-shadow-md" width="32" />
                <Icon icon="ph:map-pin-fill" className="text-secondary absolute bottom-10 left-1/2 drop-shadow-md" width="32" />
            </div>
        </div>
      </div>
    </div>
  );
}