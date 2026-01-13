//src/app/(gatedPages)/active-users/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import ActiveUserList from "@/components/List/ActiveUserList";

export default function ActiveUsersClient() {
    return (
        <RouteWrapper 
            middleSlot={
                <div className="w-full">
                    <ActiveUserList />
                </div>
            } 
        />
    );
}