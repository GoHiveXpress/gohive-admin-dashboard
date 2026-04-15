"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { Icon } from "@iconify/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function CustomerComparisonWidget() {
	return (
		<div className="border-border h-full rounded-[20px] border bg-white p-6 shadow-sm">
			<h3 className="mb-4 text-lg font-medium">Select comparison type</h3>
			<div className="relative">
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

/* eslint-enable */
