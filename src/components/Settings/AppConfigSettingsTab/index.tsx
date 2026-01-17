"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AppConfigSettingsTab() {
  return (
    <div className="bg-white rounded-[24px] p-8 border border-border shadow-sm">
        
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-medium text-foreground/80">Fees</h3>
            {/* Using a relative container for the avatar to match screenshot position roughly */}
            <div className="relative">
                 <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                    <img src="https://i.pravatar.cc/150?u=1" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
             <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Delivery fee</label>
                <Input defaultValue="₦800" className="h-12 rounded-xl border-border bg-white" />
            </div>

             <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Taxes</label>
                <div className="relative">
                    <Input defaultValue="0" className="h-12 rounded-xl border-border bg-white pr-8" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
            </div>

             <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Service fee</label>
                <Input defaultValue="₦200" className="h-12 rounded-xl border-border bg-white" />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Delivery Radius</label>
                <Input defaultValue="set in km/miles per zone" className="h-12 rounded-xl border-border bg-white" />
            </div>

             <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Commission %</label>
                 <div className="relative">
                    <Input defaultValue="5" className="h-12 rounded-xl border-border bg-white pr-8" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Region (specific overrides)</label>
                <Select>
                    <SelectTrigger className="h-12 rounded-xl border-border bg-white">
                        <SelectValue placeholder="region" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="mt-10 flex justify-center">
            <Button className="w-full max-w-md h-12 bg-secondary hover:bg-secondary/90 text-white font-medium text-base rounded-lg">
                Apply Changes
            </Button>
        </div>
    </div>
  );
}