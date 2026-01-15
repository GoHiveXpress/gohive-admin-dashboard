//src/components/List/RiderManagementList/index.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { riderColumnsConfig, RiderData } from "@/components/Tables/columns/RiderManagementColumns";


const RIDER_DATA: RiderData[] = [
    {
        id: "1",
        name: "Victor Kenny",
        email: "designbyprose@gmail.com",
        phone: "+2349056113019",
        status: "Active",
        kyc: "Verified",
        rating: 5.0,
    },
    // Add more mock data if needed
];

export default function RiderManagementList() {
    return (
        <div className="space-y-6">
            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search Bar */}
                <div className="relative w-full sm:w-[300px]">
                    <Icon
                        icon="ph:magnifying-glass"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5"
                    />
                    <Input
                        placeholder="Search"
                        className="pl-10 h-12 rounded-lg border-border bg-white"
                    />
                </div>

                {/* Filter Icon Button */}
                <Button
                    variant="outline"
                    className="h-12 w-12 p-0 rounded-lg border-border bg-white"
                >
                    <Icon icon="ph:sliders-horizontal" width="20" />
                </Button>

                {/* All (Active Filter - Orange) */}
                <Button
                    className="h-12 rounded-lg px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    All
                </Button>

                {/* Dropdowns */}
                <Button variant="outline" className="h-12 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[100px]">
                    Status <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
                <Button variant="outline" className="h-12 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[100px]">
                    KYC <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
                <Button variant="outline" className="h-12 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[120px]">
                    Availability
                </Button>
                 <Button variant="outline" className="h-12 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[140px]">
                    Performance Rating
                </Button>
            </div>

            {/* Table */}
            <DataTable
                columns={getColumns(riderColumnsConfig)}
                data={RIDER_DATA}
                title=""
            />
        </div>
    );
}