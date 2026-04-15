"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
	{ name: "0", food: 40, groceries: 20, pharmacy: 24 },
	{ name: "2", food: 30, groceries: 18, pharmacy: 28 },
	{ name: "4", food: 55, groceries: 25, pharmacy: 30 },
	{ name: "6", food: 65, groceries: 20, pharmacy: 22 },
	{ name: "8", food: 40, groceries: 25, pharmacy: 20 },
	{ name: "10", food: 50, groceries: 22, pharmacy: 18 },
	{ name: "12", food: 35, groceries: 30, pharmacy: 10 },
	{ name: "14", food: 60, groceries: 25, pharmacy: 25 },
	{ name: "16", food: 75, groceries: 35, pharmacy: 42 },
	{ name: "18", food: 55, groceries: 28, pharmacy: 35 },
	{ name: "20", food: 68, groceries: 35, pharmacy: 48 },
	{ name: "22", food: 35, groceries: 50, pharmacy: 20 },
	{ name: "24", food: 20, groceries: 75, pharmacy: 60 },
];

export default function OrderVolume() {
	return (
		<div className="border-border/50 h-full rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h3 className="text-foreground text-xl font-bold">Orders Volume</h3>
				<div className="flex items-center gap-4">
					{/* Custom Legend */}
					<div className="flex gap-3 text-[10px] font-medium">
						<div className="flex items-center gap-1">
							<span className="bg-accent size-2 rounded-full" /> Food
						</div>
						<div className="flex items-center gap-1">
							<span className="bg-secondary size-2 rounded-full" /> Groceries
						</div>
						<div className="flex items-center gap-1">
							<span className="size-2 rounded-full bg-blue-500" /> Pharmacy
						</div>
					</div>
				</div>
			</div>

			<div className="mb-6">
				<Tabs defaultValue="today" className="w-auto">
					<TabsList className="bg-muted/50 h-8 rounded-full p-1">
						<TabsTrigger
							value="today"
							className="data-[state=active]:bg-secondary h-6 rounded-full px-4 text-xs data-[state=active]:text-white"
						>
							Today
						</TabsTrigger>
						<TabsTrigger value="weekly" className="h-6 rounded-full px-4 text-xs">
							Weekly
						</TabsTrigger>
						<TabsTrigger value="monthly" className="h-6 rounded-full px-4 text-xs">
							Monthly
						</TabsTrigger>
						<TabsTrigger value="yearly" className="h-6 rounded-full px-4 text-xs">
							Yearly
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="h-[250px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
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
							tickFormatter={(value) => `${value}%`}
						/>
						<Tooltip
							contentStyle={{
								borderRadius: "8px",
								border: "none",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
							}}
						/>
						<Line
							type="monotone"
							dataKey="food"
							stroke="hsl(var(--accent))"
							strokeWidth={2}
							dot={false}
						/>
						<Line
							type="monotone"
							dataKey="groceries"
							stroke="hsl(var(--secondary))"
							strokeWidth={2}
							dot={false}
						/>
						<Line
							type="monotone"
							dataKey="pharmacy"
							stroke="#3B82F6"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

/* eslint-enable */
