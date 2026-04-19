import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
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

interface CustomerOrderVolumeReportProps {
	filters: any;
	onFilterChange: (key: string, value: string) => void;
}

export default function CustomerOrderVolumeReport({ filters, onFilterChange }: CustomerOrderVolumeReportProps) {
	const { data: analyticsResponse, isLoading } = useCustomerAnalytics(filters);
	const volumeData = analyticsResponse?.data?.volumeData || [];

	if (isLoading) {
		return (
			<div className="border-border flex h-full flex-col rounded-[20px] border bg-white p-6 shadow-sm">
				<Skeleton className="mb-4 h-8 w-48" />
				<Skeleton className="flex-1 w-full" />
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
				<div className="flex gap-4 text-xs font-medium">
					<div className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-[#F58A20]" />
						Food
					</div>
					<div className="flex items-center gap-1.5">
						<span className="bg-secondary size-2 rounded-full" />
						Groceries
					</div>
					<div className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-[#3B82F6]" />
						Pharmacy
					</div>
				</div>
			</div>

			<div className="mb-6 flex items-center gap-3">
				<Button
					variant="outline"
					size="icon"
					className="border-border size-9 bg-transparent"
				>
					<Icon icon="lucide:sliders-horizontal" className="size-4" />
				</Button>
				
				<Select value={filters.range} onValueChange={(val) => onFilterChange("range", val)}>
					<SelectTrigger className="border-border h-9 w-[120px] bg-transparent text-sm">
						<SelectValue placeholder="Date" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="today">Today</SelectItem>
						<SelectItem value="weekly">Weekly</SelectItem>
						<SelectItem value="monthly">Monthly</SelectItem>
					</SelectContent>
				</Select>

				<Select value={filters.location || "all"} onValueChange={(val) => onFilterChange("location", val === "all" ? "" : val)}>
					<SelectTrigger className="border-border h-9 w-[140px] bg-transparent text-sm">
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
					<SelectTrigger className="border-border h-9 w-[120px] bg-transparent text-sm">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						<SelectItem value="food">Food</SelectItem>
						<SelectItem value="groceries">Groceries</SelectItem>
						<SelectItem value="pharmacy">Pharmacy</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="min-h-[250px] w-full flex-1">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={volumeData}>
						<defs>
							<linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#F58A20" stopOpacity={0.1} />
								<stop offset="95%" stopColor="#F58A20" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="colorGroceries" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.1} />
								<stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="colorPharmacy" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
								<stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
							</linearGradient>
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
							contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
						/>
						<Area
							type="basis"
							dataKey="food"
							stroke="#F58A20"
							strokeWidth={3}
							fill="url(#colorFood)"
						/>
						<Area
							type="basis"
							dataKey="groceries"
							stroke="var(--secondary)"
							strokeWidth={3}
							fill="url(#colorGroceries)"
						/>
						<Area
							type="basis"
							dataKey="pharmacy"
							stroke="#3B82F6"
							strokeWidth={3}
							fill="url(#colorPharmacy)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
