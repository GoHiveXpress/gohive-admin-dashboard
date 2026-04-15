"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import CustomerOrderVolumeReport from "@/components/_widgets/CustomerOrderVolumeReport";
import CustomerComparisonWidget from "@/components/_widgets/CustomerComparisonWidget";
import CustomerRetentionReport from "@/components/_widgets/CustomerRetentionReport";

export default function CustomerReportTab() {
	return (
		<div className="space-y-6">
			<div className="grid h-[400px] grid-cols-1 gap-6 lg:grid-cols-12">
				<div className="h-full lg:col-span-8">
					<CustomerOrderVolumeReport />
				</div>
				<div className="h-full lg:col-span-4">
					<CustomerComparisonWidget />
				</div>
			</div>

			<div>
				<Button className="bg-secondary hover:bg-secondary/90 mb-6 flex h-10 items-center gap-2 rounded-lg px-6 text-white">
					<Icon icon="lucide:download" /> Export
				</Button>
				<CustomerRetentionReport />
				<Button className="bg-secondary hover:bg-secondary/90 mt-6 flex h-10 items-center gap-2 rounded-lg px-6 text-white">
					<Icon icon="lucide:download" /> Export
				</Button>
			</div>
		</div>
	);
}
