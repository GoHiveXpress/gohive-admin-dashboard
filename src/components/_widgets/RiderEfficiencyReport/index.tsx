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

export default function RiderEfficiencyReport() {
	return (
		<div className="border-border h-full rounded-[20px] border bg-white p-8 shadow-sm">
			<div className="mb-6 flex items-center gap-2">
				<Icon icon="ph:circle-fill" className="text-primary size-4" />
				<h3 className="text-xl font-medium">Rider Efficiency</h3>
			</div>

			<div className="mb-8 flex flex-wrap gap-4">
				<button className="border-border flex size-9 items-center justify-center rounded-md border">
					<Icon icon="lucide:sliders-horizontal" />
				</button>
				{["Date", "Location", "Category"].map((label) => (
					<button
						key={label}
						className="border-border flex h-9 items-center gap-2 rounded-md border bg-transparent px-3 text-sm font-medium"
					>
						{label} <Icon icon="lucide:chevron-down" className="size-3" />
					</button>
				))}
			</div>

			<div className="grid grid-cols-2 gap-x-12 gap-y-8">
				<StatsItem label="Average Delivery Time" value="35" sub="mins" />
				<StatsItem label="Acceptance Rate" value="66%" />
				<StatsItem label="Completion Rate" value="94%" />
				<StatsItem label="On Time Deliveries" value="76%" />
			</div>
		</div>
	);
}
