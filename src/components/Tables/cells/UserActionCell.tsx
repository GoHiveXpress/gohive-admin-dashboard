"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import UserManagementActionModal, { UserType } from "@/components/_modals/UserManagementActionModal";

interface UserActionCellProps {
    userType: UserType;
    rowId: string; // Useful if you need to perform API actions
}

export default function UserActionCell({ userType, rowId }: UserActionCellProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsModalOpen(true)}
            >
                <Icon icon="ph:dots-three-vertical-bold" className="w-5 h-5 text-muted-foreground" />
            </Button>

            <UserManagementActionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userType={userType}
            />
        </>
    );
}