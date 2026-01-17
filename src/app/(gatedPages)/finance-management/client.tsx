//src/app/(gatedPages)/finance-management/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";

export default function FinanceManagementClient() {
    return (
        <RouteWrapper 
            middleSlot={
              <h1 className="text-2xl font-bold text-foreground">
                Finance Management
              </h1>
            } 
        />
    );
}