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
import TopVendorsList from "@/components/List/TopVendorsList";
import PermissionGate from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/permissions";

// Order volume and the vendor leaderboard read analytics endpoints; the
// leaderboard also loads vendors. Staff without those permissions skip them.
const ANALYTICS_RULE = { all: [PERMISSIONS.ANALYTICS] };
const TOP_VENDORS_RULE = { all: [PERMISSIONS.ANALYTICS, PERMISSIONS.VENDORS] };

export default function DashboardClient() {
	return (
		<div className="flex flex-col gap-6">
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
