"use client";

import { formatNaira } from "@/lib/utils";
import { type BaseColumnSchema } from "../types";

export type RiderEarningData = {
	id: string;
	name: string;
	riderId: string;
	completedTrips: number;
	todayEarnings: number;
	earnings: number;
	payout: number;
	incentives: number;
	totalBalance: number;
};

export const riderEarningColumnsConfig: BaseColumnSchema<RiderEarningData>[] = [
	{
		key: "name",
		header: "Rider",
		render: (row) => (
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<div className="bg-secondary size-2 rounded-full" />
					<span className="text-foreground font-semibold">{row.name}</span>
				</div>
				<div className="ml-4 mt-1">
					<span className="text-muted-foreground text-[10px]">Rider ID: </span>
					<span className="border-border rounded border px-1.5 py-0.5 text-[10px]">
						{row.riderId}
					</span>
				</div>
			</div>
		),
	},
	{
		key: "completedTrips",
		header: "Completed Trip",
		render: (row) => <span className="font-medium">{row.completedTrips}</span>,
	},
	{
		key: "todayEarnings",
		header: "Today's Earnings",
		render: (row) => (
			<div className="text-secondary flex items-center gap-1 font-medium italic">
				<span className="border-secondary flex size-3 items-center justify-center rounded-full border text-[10px]">
					↓
				</span>
				{formatNaira(row.todayEarnings)}
			</div>
		),
	},
	{
		key: "earnings",
		header: "Earnings",
		render: (row) => (
			<div className="text-secondary flex items-center gap-1 font-medium">
				<span className="border-secondary flex size-3 items-center justify-center rounded-full border text-[10px]">
					↓
				</span>
				{formatNaira(row.earnings)}
			</div>
		),
	},
	{
		key: "payout",
		header: "Payout",
		render: (row) => (
			<div className="text-destructive flex items-center gap-1 font-medium">
				<span className="border-destructive flex size-3 items-center justify-center rounded-full border text-[10px]">
					↑
				</span>
				{formatNaira(row.payout)}
			</div>
		),
	},
	{
		key: "incentives",
		header: "incentives",
		render: (row) => (
			<div className="text-secondary flex items-center gap-1 font-medium">
				<span className="border-secondary flex size-3 items-center justify-center rounded-full border text-[10px]">
					↓
				</span>
				{formatNaira(row.incentives)}
			</div>
		),
	},
	{
		key: "totalBalance",
		header: "Period Balance",
		render: (row) => (
			<span className="text-foreground font-semibold">{formatNaira(row.totalBalance)}</span>
		),
	},
];
