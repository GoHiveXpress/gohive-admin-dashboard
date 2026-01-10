//src/app/(gatedPages)/dashboard/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import TopCustomers from "@/components/_widgets/TopCustomers";
import TotalRiders from "@/components/_widgets/TotalRiders";
import TopVendors from "@/components/_widgets/TopVendors";
import TotalOrders from "@/components/_widgets/TotalOrders";
import OrderVolume from "@/components/_widgets/OrderVolume";
import TotalUsers from "@/components/_widgets/TotalUsers";
import TodaysOrders from "@/components/_widgets/TodaysOrders";
import TopVendorsList from "@/components/List/TopVendorsList";

export default function DashboardClient() {
    return (
        <div className="flex flex-col gap-6">
            {/* Top Stats Row - Using a grid directly here to ensure 4 columns specifically */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TopCustomers />
                <TotalRiders />
                <TopVendors />
                <TotalOrders />
            </div>

            {/* Charts Row using RouteWrapper middleSlot for grid structure */}
            <RouteWrapper 
                middleSlot={
                    <>
                        {/* Span 2 for Order Volume, 1 for Total Users in a 3-col grid logic, 
                            but RouteWrapper default is col-1. We override via CSS inside the widgets if needed, 
                            or simpler: just use a grid container here. */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                            <div className="lg:col-span-2 h-[400px]">
                                <OrderVolume />
                            </div>
                            <div className="h-[400px]">
                                <TotalUsers />
                            </div>
                        </div>
                    </>
                } 
            />

            {/* Map Section */}
            <RouteWrapper 
                middleSlot={
                    <div className="w-full">
                        <TodaysOrders />
                    </div>
                } 
            />

            {/* Table Section */}
            <RouteWrapper 
                middleSlot={
                    <div className="w-full">
                        <TopVendorsList />
                    </div>
                } 
            />
        </div>
    );
}