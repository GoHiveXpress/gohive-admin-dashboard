"use client";

import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { Badge } from "@/components/ui/badge";
import { BaseColumnSchema } from "@/components/Tables/types";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

// Mock Data Type
type OrderHistory = {
	id: string;
	status: "Delivered" | "Pending" | "Canceled";
	date: string;
	vendor: string;
	location: string;
	amount: string;
};

// Column Config
const orderHistoryColumns: BaseColumnSchema<OrderHistory>[] = [
	{
		key: "status",
		header: "Status",
		render: (row) => {
			let color = "bg-secondary text-secondary";
			if (row.status === "Pending") color = "bg-[#FDB900] text-[#FDB900]";
			if (row.status === "Canceled") color = "bg-destructive text-destructive";

			return (
				<Badge
					variant="outline"
					className={`border-none bg-opacity-10 ${color.split(" ")[0]}/10 ${color.split(" ")[1]} px-3 py-1 rounded-full`}
				>
					<div
						className={`w-2 h-2 rounded-full mr-2 ${(color.split(" ")[0] ?? "").replace("/10", "")}`}
					/>
					{row.status}
				</Badge>
			);
		},
	},
	{ key: "date", header: "Date" },
	{ key: "vendor", header: "Vendor" },
	{
		key: "location",
		header: "Location",
		render: (row) => <div className="max-w-[150px]">{row.location}</div>,
	},
	{
		key: "amount",
		header: "Amount",
		render: (row) => <span className="font-semibold">{row.amount}</span>,
	},
];

const DATA: OrderHistory[] = [
	{
		id: "1",
		status: "Delivered",
		date: "2025-10-12",
		vendor: "Mama Foodie",
		location: "No 5, King street Offa",
		amount: "₦5,000",
	},
	{
		id: "2",
		status: "Pending",
		date: "2025-11-01",
		vendor: "Item 7",
		location: "No 5, King street Offa",
		amount: "₦5,000",
	},
	{
		id: "3",
		status: "Canceled",
		date: "2025-09-28",
		vendor: "Unique Restaurant",
		location: "No 5, King street Offa",
		amount: "₦5,000",
	},
];

export default function CustomerOrderTab() {
	return (
		<div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50">
			<div className="flex gap-3 mb-6">
				<Button variant="secondary" className="bg-[#FDB900] text-white hover:bg-[#e5a800]">
					All
				</Button>
				<Button variant="outline" className="bg-white">
					A-Z
				</Button>
				<Button variant="outline" className="bg-white justify-between min-w-[100px]">
					status <Icon icon="ph:caret-down" />
				</Button>
				<Button variant="outline" className="bg-white justify-between min-w-[100px]">
					date <Icon icon="ph:caret-down" />
				</Button>
				<Button variant="outline" className="bg-white justify-between min-w-[100px]">
					Location <Icon icon="ph:caret-down" />
				</Button>
			</div>
			<DataTable columns={getColumns(orderHistoryColumns)} data={DATA} title="" />
		</div>
	);
}
