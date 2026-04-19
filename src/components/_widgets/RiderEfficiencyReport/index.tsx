"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useRiderAnalytics } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const StatsItem = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
	<div className="flex flex-col">
		<span className="text-foreground mb-1 text-base font-medium">{label}</span>
		<div className="flex items-baseline gap-1">
			<span className="text-foreground text-4xl font-bold">{value}</span>
			{sub && <span className="text-foreground text-lg">{sub}</span>}
		</div>
	</div>
);

interface RiderEfficiencyReportProps {
	filters: any;
	onFilterChange: (key: string, value: string) => void;
}

export default function RiderEfficiencyReport({ filters, onFilterChange }: RiderEfficiencyReportProps) {
	const { data: analyticsResponse, isLoading } = useRiderAnalytics(filters);
	const metrics = analyticsResponse?.data?.metrics;
	const comparison = analyticsResponse?.data?.comparison;

	if (isLoading) {
		return (
			<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
				<Skeleton className="mb-4 h-8 w-48" />
				<div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-20 w-full" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="border-border h-full rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Icon icon="ph:circle-fill" className="text-primary size-4" />
					<h3 className="text-xl font-medium">Rider Efficiency</h3>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="icon" className="size-9 bg-transparent">
						<Icon icon="lucide:sliders-horizontal" className="size-4" />
					</Button>
					
					<Select value={filters.range} onValueChange={(val) => onFilterChange("range", val)}>
						<SelectTrigger className="h-9 w-[110px] text-sm">
							<SelectValue placeholder="Date" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="weekly">Weekly</SelectItem>
							<SelectItem value="monthly">Monthly</SelectItem>
						</SelectContent>
					</Select>

					<Select value={filters.location || "all"} onValueChange={(val) => onFilterChange("location", val === "all" ? "" : val)}>
						<SelectTrigger className="h-9 w-[130px] text-sm">
							<SelectValue placeholder="Location" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Locations</SelectItem>
							<SelectItem value="Lagos">Lagos</SelectItem>
							<SelectItem value="VI">Victoria Island</SelectItem>
							<SelectItem value="Lekki">Lekki</SelectItem>
						</SelectContent>
					</Select>

					<Select value={filters.category || "all"} onValueChange={(val) => onFilterChange("category", val === "all" ? "" : val)}>
						<SelectTrigger className="h-9 w-[110px] text-sm">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="food">Food</SelectItem>
							<SelectItem value="groceries">Groceries</SelectItem>
							<SelectItem value="pharmacy">Pharmacy</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-8">
				<div className="space-y-6">
					<div>
						<h4 className="text-muted-foreground mb-1 text-sm font-medium">Average Delivery Time</h4>
						<div className="flex items-baseline gap-2">
							<p className="text-foreground text-4xl font-bold">{metrics?.avgDeliveryTime || 0}</p>
							<span className="text-foreground text-lg">mins</span>
							{comparison && (
								<span className={`text-xs font-medium ${Number(comparison.avgDeliveryTime) <= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{comparison.avgDeliveryTime > 0 ? '+' : ''}{comparison.avgDeliveryTime}m
								</span>
							)}
						</div>
					</div>
					<div>
						<h4 className="text-muted-foreground mb-1 text-sm font-medium">Completion Rate</h4>
						<div className="flex items-baseline gap-2">
							<p className="text-foreground text-4xl font-bold">{metrics?.completionRate || 0}%</p>
							{comparison && (
								<span className={`text-xs font-medium ${Number(comparison.completionRate) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{Number(comparison.completionRate) > 0 ? '+' : ''}{comparison.completionRate}%
								</span>
							)}
						</div>
					</div>
				</div>
				<div className="space-y-6">
					<div>
						<h4 className="text-muted-foreground mb-1 text-sm font-medium">Acceptance Rate</h4>
						<p className="text-foreground text-4xl font-bold">{metrics?.acceptanceRate || 0}%</p>
					</div>
					<div>
						<h4 className="text-muted-foreground mb-1 text-sm font-medium">On Time Deliveries</h4>
						<p className="text-foreground text-4xl font-bold">{metrics?.onTimeDeliveries || 0}%</p>
					</div>
				</div>
			</div>
		</div>
	);
}
