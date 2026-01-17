//src/app/(gatedPages)/user-management/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import UsersManagement from "@/components/UsersManagement";

export default function UserManagementClient() {
    return (
        <RouteWrapper 
            middleSlot={
             <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
            } 
        >
            <UsersManagement />
        </RouteWrapper>
    );
}