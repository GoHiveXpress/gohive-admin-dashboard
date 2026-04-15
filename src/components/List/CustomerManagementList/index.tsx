// src/Components/List/CustomerManagementList/index.tsx

"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	customerColumnsConfig,
	orderColumnsConfig,
	type CustomerData,
	type OrderData,
} from "@/components/Tables/columns/CustomerColumns";
import { Badge } from "@/components/ui/badge";

const CUSTOMER_DATA: CustomerData[] = [
	{
		_id: "1",
		name: "Victor Kenny",
		email: "designbyprose@gmail.com",
		phone: "+2349056113019",
		accountStatus: "Active",
		orderCount: 12,
	},
	{
		_id: "2",
		name: "Kim Kim",
		email: "kimkim@gmail.com",
		phone: "+2349056117956",
		accountStatus: "Active",
		orderCount: 22,
	},
	{
		_id: "3",
		name: "Ade Ogunremi",
		email: "adeogunremi234@gmail.com",
		phone: "+2347021323067",
		accountStatus: "Inactive",
		orderCount: 0,
	},
	{
		_id: "4",
		name: "Gift Paul",
		email: "giftpaul234@gmail.com",
		phone: "+2348021903067",
		accountStatus: "Suspend",
		orderCount: 1,
	},
];

const ORDER_DATA: OrderData[] = [
	{
		_id: "1",
		orderId: "#OD4567",
		customer: "Victor Kenny",
		vendor: "Chicken Republic",
		rider: "James James",
		status: "Delivered",
	},
	{
		_id: "2",
		orderId: "#OD4589",
		customer: "Ade Ade",
		vendor: "Chicken Republic",
		rider: "James James",
		status: "Picked up",
	},
	{
		_id: "3",
		orderId: "#OD2338",
		customer: "Kim Kim",
		vendor: "Unique",
		rider: "James James",
		status: "Canceled",
	},
];

// --- Tab Items ---
const TAB_ITEMS: TabItem[] = [
	{ id: "customers", label: "Customer Management" },
	{ id: "orders", label: "Order Management" },
];

export default function CustomerManagementList() {
	const [activeTab, setActiveTab] = useState("customers");

	return (
		<div className="w-full space-y-6">
			{/* Header Section */}
			<div className="flex items-center gap-2">
				<Icon icon="ph:smiley-bold" className="text-secondary size-8" />
				<h1 className="text-foreground text-2xl font-bold">Customer Management</h1>
			</div>

			{/* Tabs & Content Container */}
			<div className="border-border/50 space-y-6 rounded-[20px] border bg-white p-6 shadow-sm">
				{/* Tabs Switcher */}
				<div className="bg-muted/30 w-fit rounded-full p-1.5">
					<CustomTabs
						items={TAB_ITEMS}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>
				</div>

				{/* --- CUSTOMER TAB VIEW --- */}
				{activeTab === "customers" && (
					<>
						{/* Filters */}
						<div className="flex flex-wrap items-center gap-3">
							{/* Search Bar */}
							<div className="relative w-full sm:w-[250px]">
								<Icon
									icon="ph:magnifying-glass"
									className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
								/>
								<Input
									placeholder="Search"
									className="border-border h-10 rounded-lg bg-white pl-10"
								/>
							</div>

							{/* Filter Buttons */}
							<Button
								variant="outline"
								className="border-border size-10 rounded-lg bg-white p-0"
							>
								<Icon icon="ph:sliders-horizontal" width="20" />
							</Button>
							<Button
								variant="secondary"
								className="h-10 rounded-lg bg-[#FDB900] px-6 font-medium text-white hover:bg-[#e5a800]"
							>
								All
							</Button>
							<Button
								variant="outline"
								className="border-border h-10 rounded-lg bg-white px-4 font-medium"
							>
								A-Z
							</Button>
							<Button
								variant="outline"
								className="border-border h-10 min-w-[100px] justify-between rounded-lg bg-white px-4 font-medium"
							>
								status <Icon icon="ph:caret-down" className="ml-2" />
							</Button>
							<Button
								variant="outline"
								className="border-border h-10 min-w-[110px] justify-between rounded-lg bg-white px-4 font-medium"
							>
								Location <Icon icon="ph:caret-down" className="ml-2" />
							</Button>
						</div>

						{/* Customer Table */}
						<DataTable
							columns={getColumns(customerColumnsConfig)}
							data={CUSTOMER_DATA}
							title=""
						/>
					</>
				)}

				{/* --- ORDERS TAB VIEW --- */}
				{activeTab === "orders" && (
					<>
						{/* Live Orders Stats Header */}
						<div>
							<h2 className="text-foreground mb-4 text-xl font-bold">Live Orders</h2>
							<div className="flex flex-wrap gap-3">
								<Badge className="bg-secondary hover:bg-secondary rounded-full px-3 py-1 font-normal text-white">
									<span className="mr-1 font-bold">3</span> In progress
								</Badge>
								<Badge className="rounded-full bg-[#FF4500] px-3 py-1 font-normal text-white hover:bg-[#FF4500]">
									<span className="mr-1 font-bold">3</span> En route
								</Badge>
								<Badge className="rounded-full bg-[#FDB900] px-3 py-1 font-normal text-white hover:bg-[#FDB900]">
									<span className="mr-1 font-bold">9</span> Pending
								</Badge>
								<Badge className="rounded-full bg-[#FF6B6B] px-3 py-1 font-normal text-white hover:bg-[#FF6B6B]">
									<span className="mr-1 font-bold">2</span> Delayed
								</Badge>
								<Badge className="rounded-full bg-[#A52A2A] px-3 py-1 font-normal text-white hover:bg-[#A52A2A]">
									<span className="mr-1 font-bold">0</span> Canceled
								</Badge>
							</div>
						</div>

						{/* Order Filters */}
						<div className="mt-4 flex flex-wrap items-center gap-3">
							<Button
								variant="outline"
								className="border-border size-10 rounded-lg bg-white p-0"
							>
								<Icon icon="ph:sliders-horizontal" width="20" />
							</Button>
							<Button
								variant="outline"
								className="border-border h-10 min-w-[100px] justify-between rounded-lg bg-white px-4 font-medium"
							>
								status <Icon icon="ph:caret-down" className="ml-2" />
							</Button>
							<Button
								variant="outline"
								className="border-border h-10 rounded-lg bg-white px-4 font-medium"
							>
								Vendor
							</Button>
							<Button
								variant="outline"
								className="border-border h-10 rounded-lg bg-white px-4 font-medium"
							>
								Location
							</Button>
						</div>

						{/* Map Placeholder (Large gray area in design) */}
						<div className="border-border/20 text-muted-foreground/30 flex h-64 w-full items-center justify-center rounded-[20px] border bg-[#F5F5F0]">
							{/* This represents the empty map/content area in your screenshot */}
						</div>

						{/* Legend (Bottom Right of map area in design) */}
						<div className="text-foreground flex justify-end gap-4 text-[10px] font-medium">
							<div className="flex items-center gap-1">
								<div className="bg-secondary size-2 rounded-full" /> Placed
							</div>
							<div className="flex items-center gap-1">
								<div className="size-2 rounded-full bg-blue-500" /> Prepared
							</div>
							<div className="flex items-center gap-1">
								<div className="size-2 rounded-full bg-[#FDB900]" /> Picked Up
							</div>
							<div className="flex items-center gap-1">
								<div className="size-2 rounded-full bg-green-700" /> Delivered
							</div>
							<div className="flex items-center gap-1">
								<div className="bg-destructive size-2 rounded-full" /> Canceled
							</div>
						</div>

						{/* Orders Table */}
						<DataTable
							columns={getColumns(orderColumnsConfig)}
							data={ORDER_DATA}
							title=""
						/>
					</>
				)}
			</div>
		</div>
	);
}
