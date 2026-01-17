//src/components/_modals/UserManagementActionModal/index.tsx
"use client";

import React from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; 

export type UserType = "customer" | "vendor" | "rider" | "admin";

interface UserManagementActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userType: UserType;
    userName?: string; 
}

export default function UserManagementActionModal({
    isOpen,
    onClose,
    userType,
}: UserManagementActionModalProps) {

    const actionsConfig = {
        customer: [
            "Suspend / Reactivate account",
            "Send message or campaign",
            "View complaint resolution status"
        ],
        vendor: [
            "Suspend vendor",
            "View store details",
            "Assign compliance review"
        ],
        rider: [
            "Suspend rider", 
            "Assign training module",
            "View route logs"
        ],
        admin: [
            "Add / Remove admin",
            "Change role or permissions",
            "Audit admin actions"
        ]
    };

    const currentActions = actionsConfig[userType] || [];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {/* 
                Added [&>button]:hidden to hide the default Shadcn Close button 
                so only your custom one below shows up.
            */}
            <DialogContent className="sm:max-w-[400px] p-6 rounded-[20px] bg-white border-none shadow-lg gap-6 [&>button]:hidden">
                
                <VisuallyHidden>
                    <DialogTitle>User Actions</DialogTitle>
                </VisuallyHidden>

                {/* Header: Icon and Close Button */}
                <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Icon icon="ph:user-fill" className="text-white w-5 h-5" />
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/20 hover:bg-muted/40">
                            <Icon icon="ph:x" className="w-4 h-4 text-foreground" />
                        </Button>
                    </DialogClose>
                </div>

                {/* Dynamic Buttons */}
                <div className="flex flex-col gap-4">
                    {currentActions.map((action, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start h-14 rounded-2xl border-border text-foreground font-medium hover:bg-muted/10 hover:border-primary/50 transition-all text-sm sm:text-base whitespace-normal text-left"
                            onClick={() => {
                                console.log(`Clicked: ${action}`);
                                onClose();
                            }}
                        >
                            {action}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}