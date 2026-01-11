//src/app/(gatedPages)/customer-management/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import CustomerManagementList from "@/components/List/CustomerManagementList";

export default function CustomerManagementClient() {
    return (
        <RouteWrapper 
            middleSlot={
                <div className="w-full">
                   <CustomerManagementList />
                </div>
            } 
        />
    );
}