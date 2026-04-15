"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "0", food: 20, groceries: 15, pharmacy: 18 },
	{ name: "2", food: 75, groceries: 20, pharmacy: 25 },
	{ name: "4", food: 20, groceries: 18, pharmacy: 30 },
	{ name: "6", food: 60, groceries: 25, pharmacy: 20 },
	{ name: "8", food: 35, groceries: 28, pharmacy: 22 },
	{ name: "10", food: 50, groceries: 35, pharmacy: 28 },
	{ name: "12", food: 40, groceries: 32, pharmacy: 10 },
	{ name: "14", food: 70, groceries: 20, pharmacy: 40 },
	{ name: "16", food: 55, groceries: 35, pharmacy: 42 },
	{ name: "18", food: 68, groceries: 25, pharmacy: 32 },
	{ name: "20", food: 30, groceries: 45, pharmacy: 48 },
	{ name: "22", food: 40, groceries: 10, pharmacy: 20 },
	{ name: "24", food: 15, groceries: 60, pharmacy: 55 },
];

export default function CustomerOrderVolumeReport() {
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
				<Button variant="outline" className="border-border h-9 bg-transparent px-3 text-sm">
					Date <Icon icon="lucide:chevron-down" className="ml-2 size-3" />
				</Button>
				<Button variant="outline" className="border-border h-9 bg-transparent px-3 text-sm">
					Location <Icon icon="lucide:chevron-down" className="ml-2 size-3" />
				</Button>
				<Button variant="outline" className="border-border h-9 bg-transparent px-3 text-sm">
					Category <Icon icon="lucide:chevron-down" className="ml-2 size-3" />
				</Button>
			</div>

			<div className="min-h-[250px] w-full flex-1">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={data}>
						<defs>
							<linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#F58A20" stopOpacity={0} />
								<stop offset="95%" stopColor="#F58A20" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#9CA3AF", fontSize: 12 }}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#9CA3AF", fontSize: 12 }}
							tickFormatter={(value) => `${value}%`}
						/>
						<Tooltip />
						<Area
							type="monotone"
							dataKey="food"
							stroke="#F58A20"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorFood)"
						/>
						<Area
							type="monotone"
							dataKey="groceries"
							stroke="var(--secondary)"
							strokeWidth={2}
							fillOpacity={0}
							fill="transparent"
						/>
						<Area
							type="monotone"
							dataKey="pharmacy"
							stroke="#3B82F6"
							strokeWidth={2}
							fillOpacity={0}
							fill="transparent"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
