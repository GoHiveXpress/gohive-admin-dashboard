"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useCustomerAnalytics } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface CustomerRetentionReportProps {
	filters: any;
	onFilterChange: (key: string, value: string) => void;
}

export default function CustomerRetentionReport({ filters, onFilterChange }: CustomerRetentionReportProps) {
	const { data: analyticsResponse, isLoading } = useCustomerAnalytics(filters);
	const retentionData = analyticsResponse?.data?.retentionData || [];
	const metrics = analyticsResponse?.data?.metrics || { churnRate: 0, returnRate: 0, repeatOrderRate: 0 };
	const comparison = analyticsResponse?.data?.comparison;

	if (isLoading) {
		return (
			<div className="border-border mt-6 rounded-[20px] border bg-white p-6 shadow-sm">
				<Skeleton className="h-40 w-full" />
			</div>
		);
	}

	return (
		<div className="border-border mt-6 rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-8 flex items-center gap-2">
				<Icon icon="ph:circle-fill" className="text-primary size-4" />
				<h3 className="text-xl font-medium">Customer Retention</h3>
			</div>

			<div className="grid grid-cols-12 gap-8">
				{/* Left Stats Column */}
				<div className="border-border col-span-12 space-y-8 border-r pr-6 lg:col-span-2">
					<div>
						<h4 className="text-foreground mb-1 text-base font-medium">Churn Rate</h4>
						<div className="flex items-baseline gap-2">
							<p className="text-foreground text-4xl font-bold">{metrics.churnRate}%</p>
							{comparison && (
								<span className={`text-xs font-medium ${Number(comparison.churnRate) <= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{Number(comparison.churnRate) > 0 ? '+' : ''}{comparison.churnRate}%
								</span>
							)}
						</div>
					</div>
					<div>
						<h4 className="text-foreground mb-1 text-base font-medium">Return Rate</h4>
						<div className="flex items-baseline gap-2">
							<p className="text-foreground text-4xl font-bold">{metrics.returnRate}%</p>
							{comparison && (
								<span className={`text-xs font-medium ${Number(comparison.returnRate) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{Number(comparison.returnRate) > 0 ? '+' : ''}{comparison.returnRate}%
								</span>
							)}
						</div>
					</div>
					<div>
						<h4 className="text-foreground mb-1 text-base font-medium">Repeat Order</h4>
						<div className="flex items-baseline gap-2">
							<p className="text-foreground text-4xl font-bold">{metrics.repeatOrderRate}</p>
							{comparison && (
								<span className={`text-xs font-medium ${Number(comparison.repeatOrderRate) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{Number(comparison.repeatOrderRate) > 0 ? '+' : ''}{comparison.repeatOrderRate}
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Right Chart Column */}
				<div className="col-span-12 lg:col-span-10">
					<div className="mb-6 flex flex-wrap items-center justify-between">
						<h3 className="text-xl font-medium">Retention over time (Last 30 Days)</h3>
						<div className="flex items-center gap-3">
							<div className="bg-muted/30 flex rounded-full p-1">
								<Button className="bg-secondary h-8 rounded-full px-4 text-xs text-white">
									New
								</Button>
								<Button
									variant="ghost"
									className="text-muted-foreground h-8 rounded-full px-4 text-xs"
								>
									Returning
								</Button>
							</div>
							<Button variant="outline" size="icon" className="size-9">
								<Icon icon="lucide:sliders-horizontal" className="size-4" />
							</Button>
							
							<Select value={filters.range} onValueChange={(val) => onFilterChange("range", val)}>
								<SelectTrigger className="h-9 w-[110px] text-sm">
									<SelectValue placeholder="Time" />
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

					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={retentionData}>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#E5E7EB"
								/>
								<XAxis
									dataKey="name"
									axisLine={false}
									tickLine={false}
									tick={{ fill: "#9CA3AF", fontSize: 10 }}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fill: "#9CA3AF", fontSize: 10 }}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: "12px",
										border: "1px solid #e5e7eb",
										boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
									}}
								/>
								<Line
									type="basis"
									dataKey="value"
									stroke="#F58A20"
									strokeWidth={4}
									dot={{ r: 4, fill: "#F58A20", strokeWidth: 2, stroke: "white" }}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					<div className="mt-6 flex flex-wrap gap-4">
						<Button className="bg-secondary hover:bg-secondary/90 h-11 rounded-lg px-6 font-medium text-white">
							Retention by city or campaign
						</Button>
						<Button className="h-11 rounded-lg bg-[#EF4444] px-6 font-medium text-white hover:bg-[#EF4444]/90">
							Trigger Re-engagement Campaign
						</Button>
						<Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-lg px-6 font-medium">
							Flag Drop-off Zone
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
