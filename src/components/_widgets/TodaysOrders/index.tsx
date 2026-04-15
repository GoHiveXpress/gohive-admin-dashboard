"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, react/no-array-index-key */

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";

const stats = [
	{ label: "Pending", count: 10, icon: "ph:clock-fill", color: "text-accent" },
	{ label: "En route", count: 5, icon: "ph:map-pin-fill", color: "text-destructive" },
	{ label: "Delayed", count: 10, icon: "ph:warning-circle-fill", color: "text-destructive" },
	{ label: "Delivered", count: 10, icon: "ph:check-circle-fill", color: "text-secondary" },
];

export default function TodaysOrders() {
	return (
		<div className="border-border/50 h-full rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6">
				<h3 className="text-foreground text-xl font-bold">Todays Orders</h3>
				<h2 className="text-foreground text-3xl font-bold">35</h2>
			</div>

			<div className="flex flex-col gap-6 lg:flex-row">
				{/* Left Side Stats */}
				<div className="flex w-full shrink-0 flex-col gap-3 lg:w-[200px]">
					<div className="mb-2 flex gap-2">
						<Button variant="outline" size="sm" className="h-8 w-10 p-0">
							<Icon icon="ph:sliders-horizontal" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="h-8 w-full justify-between text-xs font-normal"
						>
							Location <Icon icon="ph:caret-down" />
						</Button>
					</div>
					{stats.map((stat, i) => (
						<div
							key={i}
							className="border-border flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm"
						>
							<div className="flex items-center gap-3">
								<div
									className={`bg-muted/50 flex size-8 items-center justify-center rounded-full ${stat.color}`}
								>
									<Icon icon={stat.icon} width="18" />
								</div>
								<span className="text-foreground text-sm font-medium">
									{stat.label}
								</span>
							</div>
							<span className="text-sm font-bold">{stat.count}</span>
						</div>
					))}
				</div>

				{/* Right Side Map Placeholder */}
				<div className="bg-muted/30 relative min-h-[300px] flex-1 overflow-hidden rounded-2xl">
					<div className="absolute inset-0 flex items-center justify-center bg-[#E6EBF5]">
						<div className="text-center">
							<Icon
								icon="ph:map-trifold-duotone"
								className="text-muted-foreground/30 mx-auto"
								width="64"
							/>
							<p className="text-muted-foreground/50 mt-2 text-sm">
								Map View Integration
							</p>
						</div>
						{/* Mock Map Overlay Elements */}
						<div className="absolute right-20 top-10 rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm">
							<p className="text-xs font-bold text-purple-600">
								Offa Descendants Union
							</p>
						</div>
						<Icon
							icon="ph:map-pin-fill"
							className="text-destructive absolute left-1/3 top-1/3 drop-shadow-md"
							width="32"
						/>
						<Icon
							icon="ph:map-pin-fill"
							className="text-accent absolute bottom-1/3 right-1/3 drop-shadow-md"
							width="32"
						/>
						<Icon
							icon="ph:map-pin-fill"
							className="text-secondary absolute bottom-10 left-1/2 drop-shadow-md"
							width="32"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
