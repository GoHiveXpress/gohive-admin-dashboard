"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { apiKeysSettingsColumns, ApiKeyData } from "@/components/Tables/columns/ApiKeysSettingsColumns";

const MOCK_DATA: ApiKeyData[] = [
    { id: "1", description: "Description", apiKey: "API Key", timestamp: "Jan 26, 2026", status: "Active" },
];

export default function ApiKeysSettingsList() {
    return (
        <div className="space-y-6">
             <div className="flex justify-end">
                 <Button className="h-10 bg-secondary hover:bg-secondary/90 text-white rounded-lg gap-2 px-4">
                    <Icon icon="lucide:plus-circle" className="w-5 h-5" />
                    Generate New Key
                </Button>
             </div>
             
             <div className="bg-white rounded-[20px] p-0 shadow-sm border border-border overflow-hidden">
                 <DataTable 
                    columns={getColumns(apiKeysSettingsColumns)} 
                    data={MOCK_DATA} 
                />
             </div>
        </div>
    );
}