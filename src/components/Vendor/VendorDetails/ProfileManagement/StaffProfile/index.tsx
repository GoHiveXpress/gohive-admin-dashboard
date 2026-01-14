"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import AddNewStaffModal from "@/components/_modals/AddNewStaffModal";
import EditStaffProfileModal from "@/components/_modals/EditStaffProfileModal";

export interface StaffData {
    id: string;
    name: string;
    role: string;
    status: "Active" | "Inactive";
    email: string;
}

const MOCK_STAFF: StaffData[] = [
    { id: "1", name: "Peace Ali", role: "Manager", status: "Active", email: "peaceali@gmail.com" },
    { id: "2", name: "Grace Paul", role: "Kitchen Assistant", status: "Inactive", email: "grace@gmail.com" },
    { id: "3", name: "Grace Paul", role: "Kitchen Assistant", status: "Inactive", email: "grace2@gmail.com" },
];

export default function StaffProfile() {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <AddNewStaffModal />
            </div>

            <div className="space-y-4">
                {MOCK_STAFF.map((staff) => (
                    <div 
                        key={staff.id} 
                        className="flex items-center justify-between p-4 bg-[#FAFAF9] rounded-[16px] border border-border/30 hover:border-border transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <Icon icon="ph:user" className="w-6 h-6 text-muted-foreground" />
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground text-sm">{staff.name}</span>
                                <span className="text-xs text-muted-foreground">{staff.role}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            {/* Status Badge */}
                            <Badge 
                                variant="outline" 
                                className={`border-none px-4 py-1 rounded-full font-medium min-w-[80px] justify-center ${
                                    staff.status === "Active" 
                                    ? "bg-secondary text-white hover:bg-secondary" 
                                    : "bg-[#FF8A8A] text-white hover:bg-[#FF8A8A]"
                                }`}
                            >
                                {staff.status}
                            </Badge>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <EditStaffProfileModal staff={staff} />
                                <button className="text-muted-foreground hover:text-destructive transition-colors">
                                    <Icon icon="ph:trash-bold" width="20" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}