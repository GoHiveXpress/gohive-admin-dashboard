"use client";

import React from "react";
import { Icon } from "@iconify/react";

const StatsItem = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
	<div className="flex flex-col">
		<span className="text-foreground mb-1 text-base font-medium">{label}</span>
		<div className="flex items-baseline gap-1">
			<span className="text-foreground text-4xl font-bold">{value}</span>
			{sub && <span className="text-foreground text-lg">{sub}</span>}
		</div>
	</div>
);

export default function VendorPerformanceReport() {
	return (
		<div className="mb-8 bg-transparent">
			<div className="mb-6 flex items-center gap-2">
				<Icon icon="ph:circle-fill" className="text-primary size-4" />
				<h3 className="text-xl font-medium">Vendor Performance</h3>
			</div>
			<div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
				<StatsItem label="Avg. Prep Time" value="35" sub="mins" />
				<StatsItem label="Order Completion Rate" value="87%" />
				<StatsItem label="Cancellation Rate" value="4%" />
				<StatsItem label="Customer Rating" value="76%" />
			</div>
		</div>
	);
}
