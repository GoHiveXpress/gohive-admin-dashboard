"use client";

import { BaseColumnSchema } from "../types";

export type RiderEarningData = {
    id: string;
    name: string;
    riderId: string;
    completedTrips: number;
    earnings: string;
    payout: string;
    incentives: string;
    totalBalance: string;
};

export const riderEarningColumnsConfig: BaseColumnSchema<RiderEarningData>[] = [
    {
        key: "name",
        header: "Vendor", 
        render: (row) => (
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="font-semibold text-foreground">{row.name}</span>
                </div>
                <div className="ml-4 mt-1">
                     <span className="text-[10px] text-muted-foreground">Vendor's ID Number: </span>
                     <span className="text-[10px] border border-border rounded px-1.5 py-0.5">{row.riderId}</span>
                </div>
            </div>
        ),
    },
    {
        key: "completedTrips",
        header: "Completed Trip",
        render: (row) => <span className="font-medium">{row.completedTrips}</span>,
    },
    {
        key: "earnings",
        header: "Earnings",
        render: (row) => (
            <div className="flex items-center gap-1 text-secondary font-medium">
                <span className="text-[10px] border border-secondary rounded-full w-3 h-3 flex items-center justify-center">↓</span>
                {row.earnings}
            </div>
        ),
    },
    {
        key: "payout",
        header: "Payout",
        render: (row) => (
            <div className="flex items-center gap-1 text-destructive font-medium">
                <span className="text-[10px] border border-destructive rounded-full w-3 h-3 flex items-center justify-center">↑</span>
                {row.payout}
            </div>
        ),
    },
    {
        key: "incentives",
        header: "incentives",
        render: (row) => (
            <div className="flex items-center gap-1 text-secondary font-medium">
                <span className="text-[10px] border border-secondary rounded-full w-3 h-3 flex items-center justify-center">↓</span>
                {row.incentives}
            </div>
        ),
    },
    {
        key: "totalBalance",
        header: "Total Balance",
        render: (row) => <span className="font-semibold text-foreground">{row.totalBalance}</span>,
    },
];