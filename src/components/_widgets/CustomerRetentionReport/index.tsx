"use client";

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, react/jsx-no-useless-fragment, react/no-unstable-nested-components */

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "Jan", value: 30 },
	{ name: "Feb", value: 45 },
	{ name: "Mar", value: 42 },
	{ name: "Apr", value: 38 },
	{ name: "May", value: 46 },
	{ name: "June", value: 38 },
	{ name: "July", value: 55 },
	{ name: "Aug", value: 38 },
	{ name: "Sept", value: 35 }, // Drop off point
	{ name: "Oct", value: 32 },
	{ name: "Nov", value: 40 },
	{ name: "Dec", value: 25 },
];

export default function CustomerRetentionReport() {
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
						<p className="text-foreground text-4xl font-bold">12%</p>
					</div>
					<div>
						<h4 className="text-foreground mb-1 text-base font-medium">Return Rate</h4>
						<p className="text-foreground text-4xl font-bold">17%</p>
					</div>
					<div>
						<h4 className="text-foreground mb-1 text-base font-medium">Repeat Order</h4>
						<p className="text-foreground text-4xl font-bold">8%</p>
					</div>
				</div>

				{/* Right Chart Column */}
				<div className="col-span-12 lg:col-span-10">
					<div className="mb-6 flex flex-wrap items-center justify-between">
						<h3 className="text-xl font-medium">Retention over time</h3>
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
							<Button variant="outline" className="h-9 text-sm">
								Time <Icon icon="lucide:chevron-down" className="ml-2 size-3" />
							</Button>
							<Button variant="outline" className="h-9 text-sm">
								Location <Icon icon="lucide:chevron-down" className="ml-2 size-3" />
							</Button>
							<Button variant="outline" className="h-9 text-sm">
								City <Icon icon="lucide:chevron-down" className="ml-2 size-3" />
							</Button>
						</div>
					</div>

					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={data}>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#E5E7EB"
								/>
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
									domain={[0, 100]}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: "12px",
										border: "1px solid #e5e7eb",
										boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
									}}
								/>
								{/* Annotation simulated as a dot */}
								<Line
									type="monotone"
									dataKey="value"
									stroke="#F58A20"
									strokeWidth={2}
									dot={(props) => {
										if (props.payload.name === "Sept")
											return (
												<circle
													cx={props.cx}
													cy={props.cy}
													r={6}
													fill="#EF4444"
													stroke="white"
													strokeWidth={2}
												/>
											);
										return <></>;
									}}
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
