//src/app/(gatedPages)/rider-management/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import RiderIndex from "@src/components/Rider";

export default function RiderManagementClient() {
    return (
        <RouteWrapper 
            middleSlot={
                <RiderIndex />
            } 
        />
    );
}