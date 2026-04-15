"use client";

/* eslint-disable react/no-unescaped-entities */

import { type BaseColumnSchema } from "../types";

export type RiderEarningData = {
	id: string;
	name: string;
	riderId: string;
	completedTrips: number;
	earnings: string;
	payout: string;
	incentives: string;
	totalBalance: string;
};

export const riderEarningColumnsConfig: BaseColumnSchema<RiderEarningData>[] = [
	{
		key: "name",
		header: "Vendor",
		render: (row) => (
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<div className="bg-secondary size-2 rounded-full" />
					<span className="text-foreground font-semibold">{row.name}</span>
				</div>
				<div className="ml-4 mt-1">
					<span className="text-muted-foreground text-[10px]">Vendor's ID Number: </span>
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
		key: "earnings",
		header: "Earnings",
		render: (row) => (
			<div className="text-secondary flex items-center gap-1 font-medium">
				<span className="border-secondary flex size-3 items-center justify-center rounded-full border text-[10px]">
					↓
				</span>
				{row.earnings}
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
				{row.payout}
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
				{row.incentives}
			</div>
		),
	},
	{
		key: "totalBalance",
		header: "Total Balance",
		render: (row) => <span className="text-foreground font-semibold">{row.totalBalance}</span>,
	},
];

/* eslint-enable */
