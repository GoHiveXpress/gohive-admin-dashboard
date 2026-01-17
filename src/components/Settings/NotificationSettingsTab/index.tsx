"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";

export default function NotificationSettingsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Add Notification */}
        <div className="bg-white rounded-[24px] p-8 border border-border shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-8">
                <Icon icon="ph:circle-fill" className="text-primary w-5 h-5" />
                <h3 className="text-xl font-medium text-foreground">Add Notification</h3>
            </div>

            <div className="space-y-6 flex-1">
                 <div className="space-y-2">
                    <label className="text-base font-medium">Title</label>
                    <Input placeholder="e.g (system outage)" className="h-14 rounded-xl border-border bg-white" />
                </div>

                 <div className="space-y-2">
                    <label className="text-base font-medium">Message</label>
                    <Textarea placeholder="Input text" className="min-h-[200px] rounded-xl border-border bg-white resize-none p-4" />
                </div>
            </div>

            <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-medium text-base rounded-lg mt-8">
                Add Template
            </Button>
        </div>

        {/* Right: Notifications List */}
        <div className="bg-white rounded-[24px] p-8 border border-border shadow-sm h-full min-h-[500px]">
             <div className="flex items-center gap-2 mb-8 border-b border-border pb-4">
                <Icon icon="ph:circle-fill" className="text-primary w-5 h-5" />
                <h3 className="text-xl font-medium text-foreground">Notifications</h3>
            </div>
            
            <div className="space-y-6">
                {["System Outage", "Heavy Rain Alert", "Rider Shortage"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                            <span className="text-lg font-medium text-foreground">{item}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Icon icon="lucide:more-vertical" className="w-5 h-5" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>

    </div>
  );
}