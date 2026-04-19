"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Icon } from "@iconify/react";
import { useDashboardOverview } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";

export default function TotalUsers() {
	const { data, isLoading } = useDashboardOverview();
	const stats = data?.data;

	const chartData = [
		{
			name: "Customers",
			value: stats?.customers?.total || 0,
			color: "hsl(var(--secondary))",
		},
		{
			name: "Riders",
			value: stats?.riders?.total || 0,
			color: "hsl(var(--primary))",
		},
		{
			name: "Vendors",
			value: stats?.vendors?.total || 0,
			color: "hsl(var(--destructive))",
		},
	];

	const totalCount = chartData.reduce((acc, curr) => acc + curr.value, 0);

	return (
		<div className="border-border/50 flex h-full flex-col rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-4 flex items-center gap-2">
				<Icon icon="ph:chart-pie-slice-fill" className="text-primary" width="20" />
				<h3 className="text-foreground text-xl font-bold">Total Users</h3>
			</div>

			<div className="relative min-h-[220px] flex-1">
				{isLoading ? (
					<Skeleton className="absolute inset-0 size-full rounded-full" />
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={chartData}
								cx="50%"
								cy="50%"
								innerRadius={70}
								outerRadius={95}
								paddingAngle={0}
								dataKey="value"
								stroke="none"
							>
								{chartData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
								<Label
									value={totalCount.toLocaleString()}
									position="centerBottom"
									className="fill-foreground text-3xl font-bold"
									dy={-5}
								/>
								<Label
									value="Total Users"
									position="centerTop"
									className="fill-muted-foreground text-xs font-medium"
									dy={15}
								/>
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				)}
			</div>

			{/* Legend */}
			<div className="mt-2 flex justify-center gap-4">
				{chartData.map((item, index) => (
					<div key={index} className="flex items-center gap-1.5">
						<div
							className="size-2.5 rounded-full"
							style={{ backgroundColor: item.color }}
						/>
						<span className="text-foreground text-xs font-medium">{item.name}</span>
					</div>
				))}
			</div>
		</div>
	);
}

/* eslint-enable */
