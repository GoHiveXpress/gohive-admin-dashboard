//src/app/(gatedPages)/dashboard/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import TopCustomers from "@/components/_widgets/TopCustomers";
import TotalRiders from "@/components/_widgets/TotalRiders";
import TotalVendors from "@/components/_widgets/TotalVendors";
import TotalOrders from "@/components/_widgets/TotalOrders";
import OrderVolume from "@/components/_widgets/OrderVolume";
import TotalUsers from "@/components/_widgets/TotalUsers";
import TodaysOrders from "@/components/_widgets/TodaysOrders";
import TopVendorsList from "@/components/List/TopVendorsList";

export default function DashboardClient() {
    return (
        <div className="flex flex-col gap-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TopCustomers />
                <TotalRiders />
                <TotalVendors />
                <TotalOrders />
            </div>

           
            <RouteWrapper 
                middleSlot={
                    <>
                      
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

           
            <RouteWrapper 
                middleSlot={
                    <div className="w-full">
                        <TodaysOrders />
                    </div>
                } 
            />

         
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