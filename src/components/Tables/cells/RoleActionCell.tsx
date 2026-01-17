"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SettingsActionModal from "@/components/_modals/SettingsActionModal";

interface RoleActionCellProps {
    row: {
        id: string;
        name: string;
        adminId: string;
        role: string;
    }
}

export default function RoleActionCell({ row }: RoleActionCellProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button 
                onClick={() => setIsModalOpen(true)}
                variant="outline" 
                className="h-9 rounded-full bg-orange-50 border-orange-100 text-accent hover:bg-orange-100 hover:text-accent font-medium px-6"
            >
                Set permission
            </Button>

            <SettingsActionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                userData={row}
            />
        </>
    );
}