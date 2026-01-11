//src/app/(gatedPages)/customer-management/[id]/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import SingleCustomerView from "@/components/Customer";

export default function SingleCustomerProfile() {
    return (
        <RouteWrapper 
            middleSlot={
                <div className="w-full">
                   <SingleCustomerView />
                </div>
            } 
        />
    );
}