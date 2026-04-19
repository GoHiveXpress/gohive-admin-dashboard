// src/app/(gatedPages)/rider-management/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import RiderIndex from "@/components/Rider";

export default function RiderManagementClient() {
	return <RouteWrapper middleSlot={<RiderIndex />} />;
}
