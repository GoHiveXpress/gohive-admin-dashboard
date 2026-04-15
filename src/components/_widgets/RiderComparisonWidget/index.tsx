"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function RiderComparisonWidget() {
	return (
		<div className="border-border flex h-full flex-col justify-start rounded-[20px] border bg-white p-8 shadow-sm">
			<div className="mb-6 flex items-center gap-2">
				<Icon icon="ph:circle-fill" className="text-primary size-4" />
				<h3 className="text-xl font-medium">Compare Periods</h3>
			</div>

			<div className="mt-4">
				<h3 className="mb-4 text-lg font-medium">Select comparison type</h3>
				<Select>
					<SelectTrigger className="border-border h-14 w-full rounded-lg bg-white">
						<SelectValue placeholder="Previous day/week/month." />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="prev_day">Previous Day</SelectItem>
						<SelectItem value="prev_week">Previous Week</SelectItem>
						<SelectItem value="prev_month">Previous Month</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
