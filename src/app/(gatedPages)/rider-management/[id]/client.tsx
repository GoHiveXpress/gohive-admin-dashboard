// src/app/(gatedPages)/rider-management/[id]/client.tsx

"use client";

import RiderProfileIndex from "@/components/Rider/RiderManagementTab/RiderProfile";
import RouteWrapper from "@/layouts/RouteWrapper";

interface ClientProps {
	id: string;
}

export default function RiderDetailsClient({ id }: ClientProps) {
	return <RouteWrapper middleSlot={<RiderProfileIndex riderId={id} />} />;
}
