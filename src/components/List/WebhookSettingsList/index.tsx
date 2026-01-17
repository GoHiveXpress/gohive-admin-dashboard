"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { webhookSettingsColumns, WebhookData } from "@/components/Tables/columns/WebhookSettingsColumns";

const MOCK_DATA: WebhookData[] = [
    { id: "1", url: "https://en69805557nb5645.m.hivehook.net", description: "Description", timestamp: "Jan 26, 2026", status: "Active" },
    { id: "2", url: "https://en69805557nb5645.m.hivehook.net", description: "Description", timestamp: "Jan 26, 2026", status: "Active" },
    { id: "3", url: "https://en69805557nb5645.m.hivehook.net", description: "Description", timestamp: "Jan 26, 2026", status: "Active" },
];

export default function WebhookSettingsList() {
    return (
        <div className="bg-white rounded-[20px] p-0 shadow-sm border border-border overflow-hidden mt-6">
             <DataTable 
                columns={getColumns(webhookSettingsColumns)} 
                data={MOCK_DATA} 
            />
        </div>
    );
}