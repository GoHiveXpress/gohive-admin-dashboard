// src/app/(gatedPages)/dashboard/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import TopCustomers from "@/components/_widgets/TopCustomers";
import TotalRiders from "@/components/_widgets/TotalRiders";
import TotalVendors from "@/components/_widgets/TotalVendors";
import TotalOrders from "@/components/_widgets/TotalOrders";
import OrderVolume from "@/components/_widgets/OrderVolume";
import TotalUsers from "@/components/_widgets/TotalUsers";
import TodaysOrders from "@/components/_widgets/TodaysOrders";
import OpsKpiStrip from "@/components/_widgets/OpsKpiStrip";
import ExceptionsQueue from "@/components/_widgets/ExceptionsQueue";
import TopVendorsList from "@/components/List/TopVendorsList";
import PermissionGate from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { useOpsLiveUpdates } from "@/hooks/useOps";

// Order volume and the vendor leaderboard read analytics endpoints; the
// leaderboard also loads vendors. Staff without those permissions skip them.
const ANALYTICS_RULE = { all: [PERMISSIONS.ANALYTICS] };
const TOP_VENDORS_RULE = { all: [PERMISSIONS.ANALYTICS, PERMISSIONS.VENDORS] };
// These mirror GET /admin/ops/kpis and /admin/ops/exceptions on the backend.
const KPI_RULE = { any: [PERMISSIONS.ANALYTICS, PERMISSIONS.FINANCE] };
const OPS_RULE = {
	any: [PERMISSIONS.CUSTOMERS, PERMISSIONS.VENDORS, PERMISSIONS.RIDERS, PERMISSIONS.SUPPORT],
};

export default function DashboardClient() {
	const { allows, isLoading } = usePermissions();
	const canSeeOps = !isLoading && allows(OPS_RULE);
	const { isConnected } = useOpsLiveUpdates(canSeeOps);

	return (
		<div className="flex flex-col gap-6">
			<PermissionGate rule={KPI_RULE}>
				<OpsKpiStrip />
			</PermissionGate>

			<PermissionGate rule={OPS_RULE}>
				<ExceptionsQueue isLive={isConnected} />
			</PermissionGate>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<TopCustomers />
				<TotalRiders />
				<TotalVendors />
				<TotalOrders />
			</div>

			<RouteWrapper
				middleSlot={
					<div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
						<PermissionGate rule={ANALYTICS_RULE}>
							<div className="h-[400px] lg:col-span-2">
								<OrderVolume />
							</div>
						</PermissionGate>
						<div className="h-[400px]">
							<TotalUsers />
						</div>
					</div>
				}
			/>

			<RouteWrapper
				middleSlot={
					<div className="w-full">
						<TodaysOrders />
					</div>
				}
			/>

			<PermissionGate rule={TOP_VENDORS_RULE}>
				<RouteWrapper
					middleSlot={
						<div className="w-full">
							<TopVendorsList />
						</div>
					}
				/>
			</PermissionGate>
		</div>
	);
}
