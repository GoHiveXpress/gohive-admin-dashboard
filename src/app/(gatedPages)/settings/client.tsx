//src/app/(gatedPages)/settings/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import SettingsMain from "@/components/Settings";
import { Icon } from "@iconify/react";

export default function SettingsClient() {
    return (
        <RouteWrapper 
            middleSlot={
                <div className="flex items-center gap-3">
                    <Icon icon="lucide:settings" className="text-secondary w-8 h-8" />
                    <h1 className="text-2xl font-bold text-foreground">
                        Settings
                    </h1>
                </div>
            } 
        >
            <SettingsMain />
        </RouteWrapper>
    );
}