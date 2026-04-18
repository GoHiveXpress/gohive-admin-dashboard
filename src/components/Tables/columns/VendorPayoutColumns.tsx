"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import { Badge } from "@/components/ui/badge";
import { type BaseColumnSchema } from "../types";

export type VendorPayoutData = {
	id: string;
	vendorName: string;
	vendorId: string;
	orderVolume: number;
	todayEarnings: string;
	earnings: string;
	payout: string;
	commission: string;
	totalBalance: string;
};

export const vendorPayoutColumnsConfig: BaseColumnSchema<VendorPayoutData>[] = [
	{
		key: "vendorName",
		header: "Vendor",
		render: (row) => (
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<div className="bg-secondary size-2 rounded-full" />
					<span className="text-foreground font-semibold">{row.vendorName}</span>
				</div>
				<div className="ml-4 mt-1">
					<span className="text-muted-foreground text-[10px]">Vendor's ID Number: </span>
					<span className="border-border rounded border px-1.5 py-0.5 text-[10px]">
						{row.vendorId}
					</span>
				</div>
			</div>
		),
	},
	{
		key: "orderVolume",
		header: "Order Volume",
		render: (row) => <span className="font-medium">{row.orderVolume}</span>,
	},
	{
		key: "todayEarnings",
		header: "Today's Earnings",
		render: (row) => (
			<div className="text-secondary flex items-center gap-1 font-medium italic">
				<span className="border-secondary flex size-3 items-center justify-center rounded-full border text-[10px]">
					↓
				</span>
				{row.todayEarnings}
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
		key: "commission",
		header: "Commission deduction",
		render: (row) => (
			<div className="text-destructive flex items-center gap-1 font-medium">
				<span className="border-destructive flex size-3 items-center justify-center rounded-full border text-[10px]">
					↑
				</span>
				{row.commission}
			</div>
		),
	},
	{
		key: "totalBalance",
		header: "Period Balance",
		render: (row) => <span className="text-foreground font-semibold">{row.totalBalance}</span>,
	},
];

/* eslint-enable */
