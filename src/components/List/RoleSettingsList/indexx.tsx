"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { roleSettingsColumns, RoleSettingsData } from "@/components/Tables/columns/RoleSettingsColumns";

const MOCK_DATA: RoleSettingsData[] = [
    { id: "1", name: "Victor Kenny", adminId: "AGHV0923", status: "Active", phone: "09056113019", role: "Super Admin" },
    { id: "2", name: "Victor Kenny", adminId: "AGHV0923", status: "Suspend", phone: "09056113019", role: "Super Admin" },
    { id: "3", name: "Victor Kenny", adminId: "AGHV0923", status: "Inactive", phone: "09056113019", role: "Super Admin" },
    { id: "4", name: "Victor Kenny", adminId: "AGHV0923", status: "Active", phone: "09056113019", role: "Super Admin" },
];

export default function RoleSettingsList() {
    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <Button className="h-10 bg-secondary hover:bg-secondary/90 text-white rounded-lg gap-2 px-4">
                    <Icon icon="lucide:plus-circle" className="w-5 h-5" />
                    Add New Admin
                </Button>

                <div className="flex-1"></div>

                <div className="relative w-full sm:w-[250px]">
                     <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                     <Input placeholder="Search" className="pl-9 h-10 rounded-lg border-border bg-white" />
                </div>

                <Button variant="outline" size="icon" className="h-10 w-10 border-border bg-white rounded-lg">
                    <Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
                </Button>

                <Button className="h-10 bg-accent hover:bg-accent/90 text-white px-6 rounded-lg">All</Button>
                
                <Button variant="outline" className="h-10 border-border bg-white px-4 rounded-lg text-sm font-medium">A-Z</Button>
                
                <Button variant="outline" className="h-10 border-border bg-white px-4 rounded-lg flex items-center gap-2 text-sm font-medium">
                    Status <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                </Button>
            </div>

            <div className="bg-white rounded-[20px] p-0 shadow-sm border border-border overflow-hidden">
                <DataTable 
                    columns={getColumns(roleSettingsColumns)} 
                    data={MOCK_DATA} 
                />
            </div>
        </div>
    );
}