"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { riderLeaderboardColumns, RiderLeaderboardData } from "@/components/Tables/columns/RiderLeaderboardColumns";

const MOCK_DATA: RiderLeaderboardData[] = [
    { id: "1", rank: 1, riderName: "James James", riderId: "RGHV0923", location: "No 16, station road, Offa Kwara State", compositeScore: 88.6, tripCount: 124, avgRating: 5.0, estDeliveryTime: "28 min", totalEarnings: "₦500,000", trend: "Improving" },
    { id: "2", rank: 2, riderName: "James James", riderId: "RGHV0923", location: "No 16, station road, Offa Kwara State", compositeScore: 83.6, tripCount: 110, avgRating: 4.2, estDeliveryTime: "30 min", totalEarnings: "₦300,000", trend: "Stable" },
    { id: "3", rank: 3, riderName: "James James", riderId: "RGHV0923", location: "No 16, station road, Offa Kwara State", compositeScore: 81.6, tripCount: 90, avgRating: 4.1, estDeliveryTime: "32 min", totalEarnings: "₦200,000", trend: "Declining" },
    { id: "4", rank: 4, riderName: "James James", riderId: "RGHV0923", location: "No 16, station road, Offa Kwara State", compositeScore: 70.6, tripCount: 76, avgRating: 4.0, estDeliveryTime: "24 min", totalEarnings: "₦100,000", trend: "Improving" },
];

export default function RiderLeaderboardList() {
    return (
        <div className="w-full bg-white rounded-[20px] p-6 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-6">
                <Icon icon="lucide:bike" className="text-primary w-5 h-5" />
                <h3 className="text-lg font-semibold">Rider Leaderboard</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
                 <Button variant="outline" size="icon" className="h-10 w-10 border-border bg-transparent">
                    <Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
                </Button>
                <Button className="h-10 bg-accent hover:bg-accent/90 text-white px-6 rounded-lg">All</Button>
                
                {["Region", "Timeframe", "Vehicle Type", "Rating Threshold"].map((label) => (
                    <Button key={label} variant="outline" className="h-10 border-border bg-transparent px-4 rounded-lg flex items-center gap-2 text-sm font-medium">
                        {label} <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                    </Button>
                ))}
            </div>

            <div className="-mx-6">
                <DataTable columns={getColumns(riderLeaderboardColumns)} data={MOCK_DATA} />
            </div>

            <div className="flex items-center gap-3 mt-6">
                 <Button className="h-10 bg-secondary hover:bg-secondary/90 text-white px-4 rounded-lg flex items-center gap-2">
                    <Icon icon="lucide:download" className="w-4 h-4" /> Export
                 </Button>
                 <Button className="h-10 bg-secondary hover:bg-secondary/90 text-white px-4 rounded-lg flex items-center gap-2">
                    <Icon icon="ph:share-network" className="w-4 h-4" /> Share Report
                 </Button>
                 <div className="flex-1"></div>
                 <Button className="h-10 bg-secondary hover:bg-secondary/90 text-white px-6 rounded-lg">Reward/Incentive</Button>
                 <Button className="h-10 bg-destructive hover:bg-destructive/90 text-white px-6 rounded-lg flex items-center gap-2">
                     <Icon icon="ph:flag-fill" /> Underperformer Flagging
                 </Button>
            </div>
        </div>
    );
}