// src/app/(gatedPages)/order-management/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import OrderManagement from "@/components/Order/OrderManagement";

export default function OrderManagementClient() {
	return <RouteWrapper middleSlot={<OrderManagement />} />;
}
