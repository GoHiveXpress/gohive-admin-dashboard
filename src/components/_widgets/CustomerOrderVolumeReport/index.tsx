import React, { useMemo } from "react";
import { Icon } from "@iconify/react";
import { useCustomerAnalytics } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import {
	AreaChart,
	Area,
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

const COLORS = ["#F58A20", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B"];

interface CustomerOrderVolumeReportProps {
	filters: any;
	onFilterChange: (key: string, value: string) => void;
}

export default function CustomerOrderVolumeReport({
	filters,
	onFilterChange,
}: CustomerOrderVolumeReportProps) {
	const { data: analyticsResponse, isLoading } = useCustomerAnalytics(filters);
	const volumeData = analyticsResponse?.data?.volumeData || [];
	// One series per vendor business type found in the data
	const categories = useMemo(() => {
		const keys = new Set<string>();
		volumeData.forEach((row: Record<string, unknown>) =>
			Object.keys(row).forEach((key) => {
				if (key !== "name" && key !== "sortDate") keys.add(key);
			}),
		);
		return Array.from(keys);
	}, [volumeData]);

	if (isLoading) {
		return (
			<div className="border-border flex h-full flex-col rounded-[20px] border bg-white p-6 shadow-sm">
				<Skeleton className="mb-4 h-8 w-48" />
				<Skeleton className="w-full flex-1" />
			</div>
		);
	}

	return (
		<div className="border-border flex h-full flex-col rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex items-start justify-between">
				<div className="flex items-center gap-2">
					<Icon icon="ph:circle-fill" className="text-primary size-4" />
					<h3 className="text-xl font-medium">Orders Volume</h3>
				</div>
				<div className="flex flex-wrap justify-end gap-4 text-xs font-medium">
					{categories.map((category, index) => (
						<div key={category} className="flex items-center gap-1.5">
							<span
								className="size-2 rounded-full"
								style={{ backgroundColor: COLORS[index % COLORS.length] }}
							/>
							{category}
						</div>
					))}
				</div>
			</div>

			<div className="mb-6 flex items-center gap-3">
				<Select value={filters.range} onValueChange={(val) => onFilterChange("range", val)}>
					<SelectTrigger className="border-border h-9 w-[120px] bg-transparent text-sm">
						<SelectValue placeholder="Date" />
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

			<div className="relative min-h-[250px] w-full flex-1">
				{volumeData.length === 0 && (
					<p className="text-muted-foreground absolute inset-0 flex items-center justify-center text-sm">
						No delivered orders in this period
					</p>
				)}
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={volumeData}>
						<defs>
							{categories.map((category, index) => (
								<linearGradient
									key={category}
									id={`volume-${index}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={COLORS[index % COLORS.length]}
										stopOpacity={0.1}
									/>
									<stop
										offset="95%"
										stopColor={COLORS[index % COLORS.length]}
										stopOpacity={0}
									/>
								</linearGradient>
							))}
						</defs>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
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
								border: "none",
								boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
							}}
						/>
						{categories.map((category, index) => (
							<Area
								key={category}
								type="monotone"
								dataKey={category}
								stroke={COLORS[index % COLORS.length]}
								strokeWidth={3}
								fill={`url(#volume-${index})`}
							/>
						))}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
