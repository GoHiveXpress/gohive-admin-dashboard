"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { orderHistoryColumns, OrderHistory } from "@/components/Tables/columns/orderHistoryColumns";

// Mock Data
const DATA: OrderHistory[] = [
    {
        id: "1",
        orderId: "#OD4567",
        status: "Delivered",
        date: "2025-10-12",
        vendor: "Mama Foodie",
        item: "Jollof Rice",
        customer: "Victor Kenny",
        rider: "James James",
        location: "No 5, King street Offa",
        amount: "₦5,000",
    },
    {
        id: "2",
        orderId: "#OD4589",
        status: "Pending",
        date: "2025-11-01",
        vendor: "Item 7",
        item: "Chicken & Chips",
        customer: "Kim Kim",
        rider: "John Doe",
        location: "No 5, King street Offa",
        amount: "₦5,000",
    },
    {
        id: "3",
        orderId: "#OD2338",
        status: "Canceled",
        date: "2025-09-28",
        vendor: "Unique Restaurant",
        item: "Burger",
        customer: "Ade Ade",
        rider: "Mike Mike",
        location: "No 5, King street Offa",
        amount: "₦5,000",
    },
];

export default function OrderHistoryList() {
    return (
        <div className="space-y-6">
            {/* Filters Section */}
            <div className="flex flex-wrap gap-3 mb-6">
                <Button variant="secondary" className="bg-[#FDB900] text-white hover:bg-[#e5a800]">
                    All
                </Button>
                <Button variant="outline" className="bg-white">
                    A-Z
                </Button>
                <Button variant="outline" className="bg-white justify-between min-w-[100px]">
                    status <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
                <Button variant="outline" className="bg-white justify-between min-w-[100px]">
                    date <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
                <Button variant="outline" className="bg-white justify-between min-w-[100px]">
                    Location <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
            </div>

            {/* Table - Modal/Action removed */}
            <DataTable 
                columns={getColumns(orderHistoryColumns)} 
                data={DATA} 
                title="" 
            />
        </div>
    );
}