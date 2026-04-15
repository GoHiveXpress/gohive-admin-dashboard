// src/components/Vendor/OrderOversighTabs/index.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import LiveOrderVendorCards from "@/components/cards/LiveOrderVendorCards";

export default function OrderOversightTabs() {
	return (
		<div className="w-full">
			{/* Order Oversight Specific Filters */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Search Bar */}
				<div className="relative w-full sm:w-[300px]">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search"
						className="border-border h-12 rounded-lg bg-white pl-10"
					/>
				</div>

				{/* Filter Icon */}
				<Button variant="outline" className="border-border size-12 rounded-lg bg-white p-0">
					<Icon icon="ph:sliders-horizontal" width="20" />
				</Button>

				{/* All */}
				<Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg px-6 font-medium">
					All
				</Button>

				{/* Today */}
				<Button
					variant="outline"
					className="border-border h-12 rounded-lg bg-white px-6 font-medium"
				>
					Today
				</Button>

				{/* Delayed Dropdown */}
				<Button
					variant="outline"
					className="border-border h-12 min-w-[130px] justify-between rounded-lg bg-white px-6 font-medium"
				>
					Delayed <Icon icon="ph:caret-down" className="ml-2" />
				</Button>
			</div>

			{/* Live Orders Section */}
			<LiveOrderVendorCards />
		</div>
	);
}
