"use client";

import { BaseColumnSchema } from "../types";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export type RiderLeaderboardData = {
    id: string;
    rank: number;
    riderName: string;
    riderId: string;
    location: string;
    compositeScore: number;
    tripCount: number;
    avgRating: number;
    estDeliveryTime: string;
    totalEarnings: string;
    trend: "Improving" | "Stable" | "Declining";
};

export const riderLeaderboardColumns: BaseColumnSchema<RiderLeaderboardData>[] = [
    {
        key: "rank",
        header: "Rank",
        render: (row) => (
             <div className="flex items-center gap-2">
                {row.rank === 1 ? <Icon icon="ph:star-fill" className="text-red-500 w-5 h-5" /> : 
                 row.rank === 2 ? <Icon icon="ph:star-fill" className="text-secondary w-5 h-5" /> :
                 <Icon icon="ph:star-fill" className="text-[#8B5E3C] w-5 h-5" />}
                <span className="font-semibold text-foreground">{row.rank}</span>
            </div>
        ),
    },
    {
        key: "riderName",
        header: "Rider Name",
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-semibold text-sm">{row.riderName}</span>
                <span className="text-[10px] text-muted-foreground border border-border rounded px-1 w-fit mt-0.5">{row.riderId}</span>
            </div>
        ),
    },
    {
        key: "location",
        header: "Location",
        render: (row) => <span className="text-xs text-muted-foreground max-w-[150px] block truncate">{row.location}</span>,
    },
    {
        key: "compositeScore",
        header: "Composite Score",
        render: (row) => <span className="text-sm font-medium">{row.compositeScore}</span>,
    },
    {
        key: "tripCount",
        header: "Trip Count",
        render: (row) => <span className="text-sm font-medium">{row.tripCount}</span>,
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
        key: "estDeliveryTime",
        header: "Est. Delivery Time",
        render: (row) => <span className="text-sm">{row.estDeliveryTime}</span>,
    },
    {
        key: "totalEarnings",
        header: "Total Earnings",
        render: (row) => <span className="text-sm font-medium">{row.totalEarnings}</span>,
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