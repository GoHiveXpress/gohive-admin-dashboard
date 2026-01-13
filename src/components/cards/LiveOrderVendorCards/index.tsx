"use client";

import { Icon } from "@iconify/react";
import AlertVendorCard, { OrderCardData } from "../AlertVendorCards";

// Mock Data for the grid
const MOCK_LIVE_ORDERS: OrderCardData[] = [
    {
        id: "1",
        vendorName: "Adereal Felix",
        time: "7:45 PM",
        eta: "10 mins",
        status: "Pending",
        items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
    },
    {
        id: "2",
        vendorName: "Adereal Felix",
        time: "7:45 PM",
        eta: "10 mins",
        status: "Pending",
        items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
    },
    {
        id: "3",
        vendorName: "Adereal Felix",
        time: "7:45 PM",
        eta: "10 mins",
        status: "Preparing",
        items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
    },
    {
        id: "4",
        vendorName: "Adereal Felix",
        time: "7:45 PM",
        eta: "10 mins",
        status: "Preparing",
        items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
    },
    {
        id: "5",
        vendorName: "Adereal Felix",
        time: "7:45 PM",
        eta: "10 mins",
        status: "Delayed",
        items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
    },
    {
        id: "6",
        vendorName: "Adereal Felix",
        time: "7:45 PM",
        eta: "10 mins",
        status: "Delayed",
        items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
    },
];

export default function LiveOrderVendorCards() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
            {/* Left Side: Live Order Stats */}
            <div className="w-full lg:w-[240px] flex-shrink-0 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Icon icon="ph:broadcast-bold" className="text-secondary w-6 h-6" />
                    <h2 className="text-lg font-bold text-foreground">Live Orders</h2>
                </div>

                {/* Stats List */}
                <div className="space-y-4">
                    {/* Delayed */}
                    <div className="flex items-center gap-4 bg-[#fcfcfc] p-2 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-white">
                             <Icon icon="ph:map-pin-fill" width="20" />
                        </div>
                        <div className="flex items-center justify-between flex-1">
                             <span className="text-sm font-medium">Delayed</span>
                             <span className="text-lg font-bold">10</span>
                        </div>
                    </div>

                    {/* Preparing (Using Blue as seen in screenshot) */}
                    <div className="flex items-center gap-4 bg-[#fcfcfc] p-2 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                             <Icon icon="ph:map-pin-fill" width="20" />
                        </div>
                        <div className="flex items-center justify-between flex-1">
                             <span className="text-sm font-medium">Preparing</span>
                             <span className="text-lg font-bold">10</span>
                        </div>
                    </div>

                    {/* En route (Orange/Reddish) */}
                    <div className="flex items-center gap-4 bg-[#fcfcfc] p-2 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-[#FF4500] flex items-center justify-center text-white">
                             <Icon icon="ph:map-pin-fill" width="20" />
                        </div>
                        <div className="flex items-center justify-between flex-1">
                             <span className="text-sm font-medium">En route</span>
                             <span className="text-lg font-bold">10</span>
                        </div>
                    </div>

                    {/* Pending (Yellow/Primary) */}
                    <div className="flex items-center gap-4 bg-[#fcfcfc] p-2 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                             <Icon icon="ph:map-pin-fill" width="20" />
                        </div>
                        <div className="flex items-center justify-between flex-1">
                             <span className="text-sm font-medium">Pending</span>
                             <span className="text-lg font-bold">5</span>
                        </div>
                    </div>

                    {/* Picked up (Green/Secondary) */}
                    <div className="flex items-center gap-4 bg-[#fcfcfc] p-2 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
                             <Icon icon="ph:map-pin-fill" width="20" />
                        </div>
                        <div className="flex items-center justify-between flex-1">
                             <span className="text-sm font-medium">Picked up</span>
                             <span className="text-lg font-bold">10</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Cards Grid */}
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_LIVE_ORDERS.map((order) => (
                        <AlertVendorCard key={order.id} data={order} />
                    ))}
                </div>
            </div>
        </div>
    );
}