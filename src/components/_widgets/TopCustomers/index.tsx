"use client";

import { Icon } from "@iconify/react";

export default function TopCustomers() {
	return (
		<div className="border-border/50 flex h-full flex-col justify-between rounded-[20px] border bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between">
				<div className="border-secondary/20 flex size-12 items-center justify-center rounded-full border-2">
					<Icon icon="ph:users-three-fill" className="text-secondary" width="24" />
				</div>
				<div className="bg-secondary rounded-full px-3 py-1 text-[10px] font-bold text-white">
					Total Customers
				</div>
			</div>
			<div>
				<h2 className="text-foreground mb-1 mt-4 text-3xl font-bold">1,603</h2>
				<div className="flex items-center justify-between">
					<span className="text-secondary flex items-center gap-1 text-xs font-medium">
						+33 <span className="text-muted-foreground font-normal">to last month</span>
					</span>
					<Icon icon="ph:dots-three-vertical-bold" className="text-muted-foreground" />
				</div>
			</div>
		</div>
	);
}
