"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useMemo } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerAnalytics } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_COLORS = [
	"hsl(var(--accent))",
	"hsl(var(--secondary))",
	"#3B82F6",
	"#10B981",
	"#F59E0B",
	"#8B5CF6",
	"#EF4444",
];

export default function OrderVolume() {
	const [activeRange, setActiveRange] = useState("today");
	const { data, isLoading } = useCustomerAnalytics({ range: activeRange });

	const volumeData = data?.data?.volumeData || [];

	const categories = useMemo(() => {
		if (!volumeData.length || !volumeData[0]) return [];
		return Object.keys(volumeData[0]).filter(
			(key) => key !== "name" && key !== "sortDate",
		);
	}, [volumeData]);

	return (
		<div className="border-border/50 h-full rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h3 className="text-foreground text-xl font-bold">Orders Volume</h3>
				<div className="flex items-center gap-4">
					<div className="flex flex-wrap gap-3 text-[10px] font-medium">
						{categories.map((cat, idx) => (
							<div key={cat} className="flex items-center gap-1 capitalize">
								<span
									className="size-2 rounded-full"
									style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
								/>{" "}
								{cat}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mb-6">
				<Tabs
					value={activeRange}
					onValueChange={setActiveRange}
					className="w-auto"
				>
					<TabsList className="bg-muted/50 h-8 rounded-full p-1">
						<TabsTrigger
							value="today"
							className="data-[state=active]:bg-secondary h-6 rounded-full px-4 text-xs data-[state=active]:text-white"
						>
							Today
						</TabsTrigger>
						<TabsTrigger
							value="weekly"
							className="data-[state=active]:bg-secondary h-6 rounded-full px-4 text-xs data-[state=active]:text-white"
						>
							Weekly
						</TabsTrigger>
						<TabsTrigger
							value="monthly"
							className="data-[state=active]:bg-secondary h-6 rounded-full px-4 text-xs data-[state=active]:text-white"
						>
							Monthly
						</TabsTrigger>
						<TabsTrigger
							value="yearly"
							className="data-[state=active]:bg-secondary h-6 rounded-full px-4 text-xs data-[state=active]:text-white"
						>
							Yearly
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="h-[250px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					{isLoading ? (
						<div className="flex h-full w-full items-center justify-center">
							<Skeleton className="h-full w-full rounded-lg" />
						</div>
					) : (
						<BarChart data={volumeData}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
							<XAxis
								dataKey="name"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#9CA3AF", fontSize: 10 }}
								dy={10}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#9CA3AF", fontSize: 10 }}
								tickFormatter={(value) => `${value}`}
							/>
							<Tooltip
								cursor={{ fill: "transparent" }}
								contentStyle={{
									borderRadius: "8px",
									border: "none",
									boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
								}}
							/>
							{categories.map((cat, idx) => (
								<Bar
									key={cat}
									dataKey={cat}
									fill={CHART_COLORS[idx % CHART_COLORS.length]}
									radius={[4, 4, 0, 0]}
									barSize={20}
								/>
							))}
						</BarChart>
					)}
				</ResponsiveContainer>
			</div>
		</div>
	);
}

/* eslint-enable */
