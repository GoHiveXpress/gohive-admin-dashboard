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

interface RiderComparisonWidgetProps {
	value: string;
	onChange: (value: string) => void;
}

export default function RiderComparisonWidget({ value, onChange }: RiderComparisonWidgetProps) {
	return (
		<div className="border-border h-full rounded-[20px] border bg-white p-6 shadow-sm">
			<h3 className="mb-4 text-lg font-medium">Select comparison type</h3>
			<div className="relative">
				<Select value={value} onValueChange={onChange}>
					<SelectTrigger className="border-border h-14 w-full rounded-lg bg-white">
						<SelectValue placeholder="Previous month" />
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
