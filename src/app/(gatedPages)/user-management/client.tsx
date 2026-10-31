// src/app/(gatedPages)/user-management/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import UsersManagement from "@/components/UsersManagement";

export default function UserManagementClient() {
	return (
		<RouteWrapper>
			<UsersManagement />
		</RouteWrapper>
	);
}
