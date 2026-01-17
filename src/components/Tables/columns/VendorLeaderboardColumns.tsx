"use client";

import { BaseColumnSchema } from "../types";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type VendorLeaderboardData = {
    id: string;
    rank: number;
    vendorName: string;
    location: string;
    category: string;
    totalOrders: number;
    avgRating: number;
    deliveryTime: string;
    revenue: string;
    trend: "Improving" | "Stable" | "Declining";
};

export const vendorLeaderboardColumns: BaseColumnSchema<VendorLeaderboardData>[] = [
    {
        key: "rank",
        header: "Rank",
        render: (row) => (
            <div className="flex items-center gap-2">
                {row.rank === 1 && <Icon icon="ph:trophy-fill" className="text-yellow-500 w-5 h-5" />}
                {row.rank === 2 && <Icon icon="ph:star-fill" className="text-secondary w-5 h-5" />}
                {row.rank === 3 && <Icon icon="ph:star-fill" className="text-[#8B5E3C] w-5 h-5" />}
                <span className="font-semibold text-foreground">{row.rank}</span>
            </div>
        ),
    },
    {
        key: "vendorName",
        header: "Vendor Name",
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-semibold text-sm">{row.vendorName}</span>
            </div>
        ),
    },
    {
        key: "location",
        header: "Location",
        render: (row) => <span className="text-xs text-muted-foreground max-w-[150px] block truncate">{row.location}</span>,
    },
    {
        key: "category",
        header: "Category",
        render: (row) => <span className="text-sm">{row.category}</span>,
    },
    {
        key: "totalOrders",
        header: "Total Order",
        render: (row) => <span className="text-sm font-medium">{row.totalOrders.toLocaleString()}</span>,
    },
    {
        key: "avgRating",
        header: "Avg Rating",
        render: (row) => (
            <div className="flex items-center gap-1">
                <Icon icon="ph:star-fill" className="text-primary w-4 h-4" />
                <span className="text-sm font-medium">{row.avgRating.toFixed(1)}</span>
            </div>
        ),
    },
    {
        key: "deliveryTime",
        header: "Delivery Time",
        render: (row) => <span className="text-sm">{row.deliveryTime}</span>,
    },
    {
        key: "revenue",
        header: "Revenue",
        render: (row) => <span className="text-sm font-medium">{row.revenue}</span>,
    },
    {
        key: "trend",
        header: "Trend",
        render: (row) => {
            const color = row.trend === "Improving" ? "text-secondary" : row.trend === "Declining" ? "text-destructive" : "text-primary";
            const icon = row.trend === "Improving" ? "ph:trend-up" : row.trend === "Declining" ? "ph:trend-down" : "ph:minus";
            return (
                <div className={`flex items-center gap-1 ${color} text-xs font-medium`}>
                    <Icon icon={icon} className="w-4 h-4" />
                    {row.trend}
                </div>
            );
        },
    },
    {
        key: "action",
        header: "",
        render: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon icon="ph:dots-three-vertical-bold" className="w-5 h-5 text-muted-foreground" />
            </Button>
        ),
    },
];