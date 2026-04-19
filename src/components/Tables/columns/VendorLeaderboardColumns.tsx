"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, no-nested-ternary */

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type BaseColumnSchema } from "../types";

import { VendorLeaderboardData, RiderLeaderboardData } from "@/types/analytics";

export const vendorLeaderboardColumns: BaseColumnSchema<VendorLeaderboardData>[] = [
	{
		key: "rank",
		header: "Rank",
		render: (row) => (
			<div className="flex items-center gap-2">
				{row.rank === 1 && (
					<Icon icon="ph:trophy-fill" className="size-5 text-yellow-500" />
				)}
				{row.rank === 2 && <Icon icon="ph:star-fill" className="text-secondary size-5" />}
				{row.rank === 3 && <Icon icon="ph:star-fill" className="size-5 text-[#8B5E3C]" />}
				<span className="text-foreground font-semibold">{row.rank}</span>
			</div>
		),
	},
	{
		key: "vendorName",
		header: "Vendor Name",
		render: (row) => (
			<div className="flex flex-col">
				<span className="text-sm font-semibold">{row.vendorName}</span>
			</div>
		),
	},
	{
		key: "location",
		header: "Location",
		render: (row) => (
			<span className="text-muted-foreground block max-w-[150px] truncate text-xs">
				{row.location}
			</span>
		),
	},
	{
		key: "category",
		header: "Category",
		render: (row) => <span className="text-sm">{row.category}</span>,
	},
	{
		key: "totalOrders",
		header: "Total Order",
		render: (row) => (
			<span className="text-sm font-medium">{row.totalOrders.toLocaleString()}</span>
		),
	},
	{
		key: "avgRating",
		header: "Avg Rating",
		render: (row) => (
			<div className="flex items-center gap-1">
				<Icon icon="ph:star-fill" className="text-primary size-4" />
				<span className="text-sm font-medium">{row.avgRating.toFixed(1)}</span>
			</div>
		),
	},
	{
		key: "deliveryTime",
		header: "Delivery Time",
		render: (row) => <span className="text-sm">{row.deliveryTime}</span>,
	},
	{
		key: "revenue",
		header: "Revenue",
		render: (row) => <span className="text-sm font-medium">{row.revenue}</span>,
	},
	{
		key: "trend",
		header: "Trend",
		render: (row) => {
			const color =
				row.trend === "Improving"
					? "text-secondary"
					: row.trend === "Declining"
						? "text-destructive"
						: "text-primary";
			const icon =
				row.trend === "Improving"
					? "ph:trend-up"
					: row.trend === "Declining"
						? "ph:trend-down"
						: "ph:minus";
			return (
				<div className={`flex items-center gap-1 ${color} text-xs font-medium`}>
					<Icon icon={icon} className="size-4" />
					{row.trend}
				</div>
			);
		},
	},
	{
		key: "action",
		header: "",
		render: () => (
			<Button variant="ghost" size="icon" className="size-8">
				<Icon icon="ph:dots-three-vertical-bold" className="text-muted-foreground size-5" />
			</Button>
		),
	},
];

/* eslint-enable */
