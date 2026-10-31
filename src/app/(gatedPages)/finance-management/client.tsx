// src/app/(gatedPages)/finance-management/client.tsx

"use client";

import FinanceManagement from "@/components/FinanceManagement";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function FinanceManagementClient() {
	return (
		<RouteWrapper>
			<FinanceManagement />
		</RouteWrapper>
	);
}
