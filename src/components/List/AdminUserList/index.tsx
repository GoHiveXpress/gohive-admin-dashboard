"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { adminUserColumns, AdminUserData } from "@/components/Tables/columns/AdminUserColumns";

const MOCK_DATA: AdminUserData[] = [
    {
        id: "1",
        name: "Victor Kenny",
        adminId: "AGHV0923",
        role: "Super Admin",
        activityType: "Add Support Admin",
        date: "12 Dec 2025 | 11:43 AM",
        status: "Active",
    }
];

export default function AdminUserList() {
    return (
        <div className="w-full bg-white rounded-[20px] pt-6 shadow-sm border border-border/50">
            <DataTable 
                columns={getColumns(adminUserColumns)} 
                data={MOCK_DATA} 
            />
        </div>
    );
}