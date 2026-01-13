"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { customerColumnsConfig, CustomerData } from "@/components/Tables/columns/customerManagementColumns";

const CUSTOMER_DATA: CustomerData[] = [
    { id: "1", name: "Victor Kenny", email: "designbyprose@gmail.com", phone: "+2349056113019", status: "Active", orders: 12 },
    { id: "2", name: "Kim Kim", email: "kimkim@gmail.com", phone: "+2349056117956", status: "Active", orders: 22 },
    { id: "3", name: "Ade Ogunremi", email: "adeogunremi234@gmail.com", phone: "+2347021323067", status: "Inactive", orders: 0 },
    { id: "4", name: "Gift Paul", email: "giftpaul234@gmail.com", phone: "+2348021903067", status: "Suspend", orders: 1 },
];

export default function CustomerManagementTabList() {
    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full sm:w-[250px]">
                    <Icon icon="ph:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input placeholder="Search" className="pl-10 h-10 rounded-lg border-border bg-white" />
                </div>
                <Button variant="outline" className="h-10 w-10 p-0 rounded-lg border-border bg-white">
                    <Icon icon="ph:sliders-horizontal" width="20" />
                </Button>
                <Button variant="secondary" className="h-10 rounded-lg px-6 font-medium bg-[#FDB900] text-white hover:bg-[#e5a800]">
                    All
                </Button>
                <Button variant="outline" className="h-10 rounded-lg border-border bg-white px-4 font-medium">
                    A-Z
                </Button>
                <Button variant="outline" className="h-10 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[100px]">
                    status <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
                <Button variant="outline" className="h-10 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[110px]">
                    Location <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
            </div>

            {/* Customer Table */}
            <DataTable
                columns={getColumns(customerColumnsConfig)}
                data={CUSTOMER_DATA}
                title=""
            />
        </div>
    );
}