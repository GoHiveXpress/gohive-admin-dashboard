//src/app/(gatedPages)/vendor-management/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import VendorIndex from "@/components/Vendor"; 

export default function VendorManagementClient() {
    return (
        <RouteWrapper 
            middleSlot={
                <VendorIndex />
            } 
        />
    );
}