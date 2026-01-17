"use client";

import { BaseColumnSchema } from "../types";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import UserActionCell from "@/components/Tables/cells/UserActionCell"; // Import the cell

export type CustomerUserData = {
    id: string;
    name: string;
    customerId: string;
    email: string;
    phone: string;
    activityType: string;
    date: string;
    status: "Active" | "Inactive";
};

export const customerUserColumns: BaseColumnSchema<CustomerUserData>[] = [
    // ... existing columns (Name, Email, Phone, Activity, Date, Status) ...
    {
        key: "name",
        header: "Name",
        render: (row) => (
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <Icon icon="ph:circle-fill" className="text-secondary w-2 h-2" />
                    <span className="font-semibold text-foreground text-sm">{row.name}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 ml-4">
                    <span className="text-[10px] text-muted-foreground">Customer ID Number:</span>
                    <span className="text-[10px] border border-border rounded px-1.5 py-0.5 bg-muted/20">{row.customerId}</span>
                </div>
            </div>
        ),
    },
    {
        key: "email",
        header: "Email",
        render: (row) => <span className="text-sm text-foreground">{row.email}</span>,
    },
    {
        key: "phone",
        header: "Phone Number",
        render: (row) => <span className="text-sm text-foreground">{row.phone}</span>,
    },
    {
        key: "activityType",
        header: "Activity Type",
        render: (row) => <span className="text-sm text-muted-foreground font-medium">{row.activityType}</span>,
    },
    {
        key: "date",
        header: "Date & Time Stamp",
        render: (row) => <span className="text-sm text-muted-foreground">{row.date}</span>,
    },
    {
        key: "status",
        header: "Status",
        render: (row) => (
            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-3 py-1 rounded-full font-medium shadow-none">
                <Icon icon="ph:circle-fill" className="w-2 h-2 mr-2" />
                {row.status}
            </Badge>
        ),
    },
    // UPDATED ACTION COLUMN
    {
        key: "action",
        header: "",
        render: (row) => <UserActionCell userType="customer" rowId={row.id} />,
    },
];