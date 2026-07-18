"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useDashboardOverview } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import GoogleRoutesMap from "@/components/Map/GoogleRoutesMap";

export default function TodaysOrders() {
	const [loadMap, setLoadMap] = useState(false);
	const { data, isLoading } = useDashboardOverview();
	const stats = (data?.data?.today || {}) as any;
	const activeOrders = data?.data?.activeOrders || [];

	useEffect(() => {
		const timer = window.setTimeout(() => setLoadMap(true), 1000);
		return () => window.clearTimeout(timer);
	}, []);

	const statusCards = [
		{
			label: "Pending",
			count: stats.pending || 0,
			icon: "ph:clock-fill",
			color: "text-accent",
		},
		{
			label: "Accepted",
			count: stats.accepted || 0,
			icon: "ph:check-square-fill",
			color: "text-secondary",
		},
		{
			label: "Preparing",
			count: stats.preparing || 0,
			icon: "ph:cooking-pot-fill",
			color: "text-primary",
		},
		{
			label: "Picked Up",
			count: stats.picked_up || 0,
			icon: "ph:moped-fill",
			color: "text-primary",
		},
		{
			label: "Delivered",
			count: stats.delivered || 0,
			icon: "ph:check-circle-fill",
			color: "text-secondary",
		},
	];

	return (
		<div className="border-border/50 h-full rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6">
				<h3 className="text-foreground text-xl font-bold">Todays Orders</h3>
				{isLoading ? (
					<Skeleton className="h-9 w-20" />
				) : (
					<h2 className="text-foreground text-3xl font-bold">
						{stats.total || 0}
					</h2>
				)}
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
					{isLoading
						? Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-[52px] w-full rounded-xl" />
							))
						: statusCards.map((stat, i) => (
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
									<span className="text-sm font-bold">
										{stat.count.toLocaleString()}
									</span>
								</div>
							))}
				</div>

				{/* Right Side Map Integration */}
				<div className="bg-muted/30 relative min-h-[350px] flex-1 overflow-hidden rounded-2xl border border-border/50">
					{isLoading || !loadMap ? (
						<Skeleton className="h-full w-full" />
					) : (
						<GoogleRoutesMap orders={activeOrders} />
					)}
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
