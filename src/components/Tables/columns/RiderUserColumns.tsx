"use client";

import { BaseColumnSchema } from "../types";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import UserActionCell from "@/components/Tables/cells/UserActionCell"; // Import the cell

export type RiderUserData = {
    id: string;
    riderName: string;
    riderId: string;
    vehicleType: string;
    phone: string;
    activityType: string;
    date: string;
    rating: number;
    status: "Active" | "Offline";
};

export const riderUserColumns: BaseColumnSchema<RiderUserData>[] = [
    // ... existing columns ...
    {
        key: "riderName",
        header: "Store Name", // Keeping label as per design, assuming Rider Name
        render: (row) => (
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <Icon icon="ph:circle-fill" className="text-secondary w-2 h-2" />
                    <span className="font-semibold text-foreground text-sm">{row.riderName}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 ml-4">
                    <span className="text-[10px] text-muted-foreground">Rider ID Number:</span>
                    <span className="text-[10px] border border-border rounded px-1.5 py-0.5 bg-muted/20">{row.riderId}</span>
                </div>
            </div>
        ),
    },
    {
        key: "vehicleType",
        header: "Vehicle Type",
        render: (row) => <span className="text-sm text-foreground">{row.vehicleType}</span>,
    },
    {
        key: "phone",
        header: "Phone Number",
        render: (row) => <span className="text-sm text-foreground">{row.phone}</span>,
    },
    {
        key: "activityType",
        header: "Activity Type",
        render: (row) => <span className="text-sm text-muted-foreground font-medium max-w-[120px] block">{row.activityType}</span>,
    },
    {
        key: "date",
        header: "Date & Time Stamp",
        render: (row) => <span className="text-sm text-muted-foreground">{row.date}</span>,
    },
    {
        key: "rating",
        header: "Rating",
        render: (row) => (
            <div className="flex items-center gap-1">
                <Icon icon="ph:star-fill" className="text-primary w-4 h-4" />
                <span className="text-sm font-medium">{row.rating.toFixed(1)}</span>
            </div>
        ),
    },
    {
        key: "status",
        header: "Status",
        render: (row) => (
            <Badge variant="outline" className="bg-muted text-foreground border-border px-3 py-1 rounded-full font-medium shadow-none">
                <Icon icon="ph:circle-fill" className="w-2 h-2 mr-2 text-destructive" />
                {row.status}
            </Badge>
        ),
    },
    // UPDATED ACTION COLUMN
    {
        key: "action",
        header: "",
        render: (row) => <UserActionCell userType="rider" rowId={row.id} />,
    },
];