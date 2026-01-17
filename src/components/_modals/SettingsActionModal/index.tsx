"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Separator } from "@/components/ui/separator";

interface SettingsActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        id: string;
        name: string;
        adminId: string;
        role: string;
    };
}

const PERMISSIONS_LEFT = [
    "Customer Management",
    "Vendor Management",
    "Rider Management",
    "Edit",
    "Messaging"
];

const PERMISSIONS_RIGHT = [
    "Finance",
    "Customer Support",
    "Broadcast",
    "Analytics & Reports",
    "Download"
];

export default function SettingsActionModal({
    isOpen,
    onClose,
    userData,
}: SettingsActionModalProps) {
    // Mock state for checkboxes (all true to match screenshot)
    const [permissions, setPermissions] = useState<Record<string, boolean>>({
        "Customer Management": true,
        "Vendor Management": true,
        "Rider Management": true,
        "Edit": true,
        "Messaging": true,
        "Finance": true,
        "Customer Support": true,
        "Broadcast": true,
        "Analytics & Reports": true,
        "Download": true,
    });

    const togglePermission = (key: string) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-8 rounded-[24px] bg-white border-none shadow-xl gap-0 [&>button]:hidden">
                
                <VisuallyHidden>
                    <DialogTitle>Permissions matrix</DialogTitle>
                </VisuallyHidden>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-medium text-foreground">Permissions matrix</h2>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted/20 hover:bg-muted/40">
                            <Icon icon="ph:x" className="w-4 h-4 text-foreground" />
                        </Button>
                    </DialogClose>
                </div>

                {/* User Info & Suspend Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                                <img src={`https://i.pravatar.cc/150?u=${userData.id}`} alt={userData.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white"></span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-foreground">{userData.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground">Admin ID Number:</span>
                                <span className="text-xs border border-border rounded px-2 py-0.5 bg-muted/20">{userData.adminId}</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="ghost" className="bg-red-50 hover:bg-red-100 text-destructive rounded-full px-6 h-10 gap-2 font-medium">
                        <Icon icon="ph:minus-circle-fill" className="w-5 h-5" />
                        Suspend Account
                    </Button>
                </div>

                {/* Role Selector */}
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-base font-medium text-foreground">Role</span>
                    <Select defaultValue="Customer Support">
                        <SelectTrigger className="w-[200px] h-11 rounded-xl border-border bg-white text-base">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Customer Support">Customer Support</SelectItem>
                            <SelectItem value="Super Admin">Super Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator className="bg-border mb-8" />

                {/* Permissions Grid */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-10">
                    
                    {/* Left Column */}
                    <div className="flex-1 space-y-6">
                        {PERMISSIONS_LEFT.map((perm) => (
                            <div key={perm} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-secondary" />
                                    <label className="text-base text-foreground/80 font-medium cursor-pointer" onClick={() => togglePermission(perm)}>
                                        {perm}
                                    </label>
                                </div>
                                <Checkbox 
                                    checked={permissions[perm]} 
                                    onCheckedChange={() => togglePermission(perm)}
                                    className="h-6 w-6 rounded border-border data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=checked]:text-white"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Vertical Separator (Only on md screens and up) */}
                    <div className="hidden md:block w-[1px] bg-border self-stretch" />

                    {/* Right Column */}
                    <div className="flex-1 space-y-6">
                        {PERMISSIONS_RIGHT.map((perm) => (
                            <div key={perm} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-secondary" />
                                    <label className="text-base text-foreground/80 font-medium cursor-pointer" onClick={() => togglePermission(perm)}>
                                        {perm}
                                    </label>
                                </div>
                                <Checkbox 
                                    checked={permissions[perm]} 
                                    onCheckedChange={() => togglePermission(perm)}
                                    className="h-6 w-6 rounded border-border data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=checked]:text-white"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Button */}
                <div className="flex justify-center">
                    <Button 
                        onClick={onClose}
                        className="w-[300px] h-12 bg-secondary hover:bg-secondary/90 text-white font-medium text-lg rounded-lg"
                    >
                        Apply Changes
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}