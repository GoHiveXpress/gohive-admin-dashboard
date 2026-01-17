"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

// Simple Switch Component for this view
const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            checked ? "bg-secondary" : "bg-input"
        )}
    >
        <span
            className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out",
                checked ? "translate-x-5" : "translate-x-0"
            )}
        />
    </button>
);

export default function ProfileSettingsTab() {
    const [notifications, setNotifications] = useState({ push: true, sms: true, email: true });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* === Left: Personal Information === */}
            <div className="bg-white rounded-[24px] p-8 border border-border shadow-sm space-y-8">
                <h3 className="text-xl font-medium text-foreground/80">Personal Information</h3>
                
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                            <img src="https://i.pravatar.cc/150?u=1" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-secondary rounded-full border-2 border-white flex items-center justify-center text-white">
                            <Icon icon="lucide:pencil" className="w-3 h-3" />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Victor Kenny</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Admin ID Number:</span>
                            <span className="text-xs border border-border rounded px-2 py-0.5 bg-muted/20">AGHV0923</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">First Name</label>
                        <Input defaultValue="Victor" className="h-12 rounded-xl border-border bg-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Last Name</label>
                        <Input defaultValue="Kenny" className="h-12 rounded-xl border-border bg-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Email</label>
                        <Input defaultValue="designbyprose@gmail.com" className="h-12 rounded-xl border-border bg-white" />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Role</label>
                        <div className="relative">
                            <Input defaultValue="Customer Support" disabled className="h-12 rounded-xl border-border bg-muted/20 text-muted-foreground" />
                            <Icon icon="lucide:lock" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4" />
                        </div>
                    </div>

                    <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-medium text-base rounded-xl mt-4">
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* === Right: Notification & Security === */}
            <div className="bg-white rounded-[24px] p-8 border border-border shadow-sm space-y-10 h-full">
                
                {/* Notifications */}
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-foreground/80">Notification Preference</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                            <span className="font-medium text-sm">Push</span>
                            <Switch checked={notifications.push} onCheckedChange={(v) => setNotifications(p => ({...p, push: v}))} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                            <span className="font-medium text-sm">SMS</span>
                            <Switch checked={notifications.sms} onCheckedChange={(v) => setNotifications(p => ({...p, sms: v}))} />
                        </div>
                         <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                            <span className="font-medium text-sm">Email Alert</span>
                            <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications(p => ({...p, email: v}))} />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-foreground/80">Security Settings</h3>
                    <div className="space-y-4">
                        <Button variant="outline" className="w-full h-14 rounded-xl border-border bg-muted/20 hover:bg-muted/30 text-foreground justify-center gap-3 font-medium">
                            <Icon icon="lucide:lock" className="w-5 h-5" /> Change Password
                        </Button>
                        <Button className="w-full h-14 rounded-xl bg-secondary hover:bg-secondary/90 text-white justify-center gap-3 font-medium">
                            <Icon icon="lucide:shield-check" className="w-5 h-5" /> Set Two-factor Auth
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}