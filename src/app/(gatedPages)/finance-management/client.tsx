//src/app/(gatedPages)/finance-management/client.tsx
"use client";

import FinanceManagement from "@/components/FinanceManagement";
import RouteWrapper from "@/layouts/RouteWrapper";

import { Icon } from "@iconify/react";

export default function FinanceManagementClient() {
    return (
        <RouteWrapper 
            middleSlot={
              <div className="flex items-center gap-3">
                  <Icon icon="lucide:truck" className="text-secondary w-8 h-8" />
                  <h1 className="text-2xl font-bold text-foreground">
                    Finance & Settlements
                  </h1>
              </div>
            } 
        >
            <FinanceManagement />
        </RouteWrapper>
    );
}