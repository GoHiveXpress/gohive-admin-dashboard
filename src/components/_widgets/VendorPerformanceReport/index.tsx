import React from "react";
import { Icon } from "@iconify/react";
import { useVendorAnalytics } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface StatsCardProps {
	label: string;
	value: string;
	sub?: string;
	icon: string;
	trend?: string;
	isNegative?: boolean;
}

const StatsCard = ({ label, value, sub, icon, trend, isNegative }: StatsCardProps) => (
	<div className="border-border flex flex-col rounded-[20px] border bg-white p-6 shadow-sm transition-all hover:shadow-md">
		<div className="mb-4 flex items-center justify-between">
			<div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
				<Icon icon={icon} className="text-primary size-5" />
			</div>
			{trend && (
				<div
					className={`flex items-center gap-1 text-sm font-medium ${isNegative ? "text-red-500" : "text-green-500"}`}
				>
					<Icon
						icon={isNegative ? "lucide:trending-down" : "lucide:trending-up"}
						className="size-4"
					/>
					{trend}
				</div>
			)}
		</div>
		<span className="text-muted-foreground mb-1 text-sm font-medium">{label}</span>
		<div className="flex items-baseline gap-1">
			<span className="text-foreground text-3xl font-bold">{value}</span>
			{sub && <span className="text-muted-foreground text-sm">{sub}</span>}
		</div>
	</div>
);

interface VendorPerformanceReportProps {
	filters: any;
	onFilterChange: (key: string, value: string) => void;
}

export default function VendorPerformanceReport({
	filters,
	onFilterChange,
}: VendorPerformanceReportProps) {
	const { data: analyticsResponse, isLoading } = useVendorAnalytics(filters);
	const metrics = analyticsResponse?.data?.metrics;
	const comparison = analyticsResponse?.data?.comparison;

	if (isLoading) {
		return (
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Skeleton key={i} className="h-[160px] w-full rounded-[20px]" />
				))}
			</div>
		);
	}

	return (
		<div className="mb-8">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Icon icon="ph:circle-fill" className="text-primary size-4" />
					<h3 className="text-xl font-medium">Vendor Performance</h3>
				</div>

				<div className="flex items-center gap-3">
					<Select
						value={filters.range}
						onValueChange={(val) => onFilterChange("range", val)}
					>
						<SelectTrigger className="border-border h-9 w-[120px] bg-white text-sm">
							<SelectValue placeholder="Timeframe" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="weekly">Weekly</SelectItem>
							<SelectItem value="monthly">Monthly</SelectItem>
							<SelectItem value="yearly">Yearly</SelectItem>
							<SelectItem value="all_time">All time</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					label="Avg. Prep Time"
					value={String(metrics?.avgPrepTime || 0)}
					sub="mins"
					icon="lucide:clock"
					trend={comparison ? `${Math.abs(comparison.avgPrepTime)}m` : undefined}
					isNegative={Number(comparison?.avgPrepTime) > 0} // Higher prep time is bad
				/>
				<StatsCard
					label="Order Completion"
					value={`${metrics?.completionRate || 0}%`}
					icon="lucide:check-circle"
					trend={
						comparison ? `${Math.abs(Number(comparison.completionRate))}%` : undefined
					}
					isNegative={Number(comparison?.completionRate) < 0}
				/>
				<StatsCard
					label="Cancellation Rate"
					value={`${metrics?.cancellationRate || 0}%`}
					icon="lucide:x-circle"
					trend={
						comparison ? `${Math.abs(Number(comparison.cancellationRate))}%` : undefined
					}
					isNegative={Number(comparison?.cancellationRate) > 0}
				/>
				<StatsCard
					label="Rating Score"
					value={`${metrics?.customerRating || 0}%`}
					icon="lucide:star"
					trend={
						comparison ? `${Math.abs(Number(comparison.customerRating))}%` : undefined
					}
					isNegative={Number(comparison?.customerRating) < 0}
				/>
			</div>
		</div>
	);
}
