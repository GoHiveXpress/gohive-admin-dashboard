"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { vendorPayoutColumnsConfig, VendorPayoutData } from "@/components/Tables/columns/VendorPayoutColumns";

const MOCK_DATA: VendorPayoutData[] = [
    { id: "1", vendorName: "Item 7 Go", vendorId: "VGHV0923", orderVolume: 123, earnings: "₦300.000", payout: "₦200.000", commission: "₦1000", totalBalance: "₦90.000" },
    { id: "2", vendorName: "Unique", vendorId: "VGHV1923", orderVolume: 93, earnings: "₦200.000", payout: "₦200.000", commission: "₦00.00", totalBalance: "₦00.00" },
    { id: "3", vendorName: "Item 7 Go", vendorId: "VGHV0923", orderVolume: 58, earnings: "₦100.000", payout: "₦50.000", commission: "₦1000", totalBalance: "₦149.000" },
];

export default function VendorPayoutList() {
    return (
        <div className="w-full bg-white rounded-[20px] p-6 shadow-sm border border-border">
            {/* Header / Filter Row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative w-full sm:w-[300px]">
                    <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search" className="pl-9 h-10 rounded-lg border-border bg-transparent" />
                </div>

                <Button variant="outline" size="icon" className="h-10 w-10 border-border bg-transparent">
                    <Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
                </Button>

                <Button className="h-10 bg-accent hover:bg-accent/90 text-white px-6 rounded-lg">All</Button>

                <Button variant="outline" className="h-10 border-border bg-transparent px-4 rounded-lg flex items-center gap-2 text-sm font-medium">
                    sort by <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                </Button>
            </div>

            {/* Table */}
            <div className="-mx-6">
                <DataTable
                    columns={getColumns(vendorPayoutColumnsConfig)}
                    data={MOCK_DATA}
                />
            </div>

            {/* Footer */}
            <div className="mt-8 border-t border-border pt-6">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-foreground">
                    <Icon icon="lucide:download" className="w-4 h-4" />
                    Download Report
                </div>
                <div className="flex gap-3">
                    <Button className="bg-secondary hover:bg-secondary/90 text-white w-20">PDF</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-20">CVS</Button>
                </div>
            </div>
        </div>
    );
}