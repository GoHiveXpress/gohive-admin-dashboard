//src/COmponents/List/CustomerManagementList/index.tsx
"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomTabs, { TabItem } from "@/components/Tabs";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	customerColumnsConfig,
	orderColumnsConfig,
	CustomerData,
	OrderData,
} from "@/components/Tables/columns/CustomerManagementColumns";
import { Badge } from "@/components/ui/badge";

// --- Mock Data: Customers ---
const CUSTOMER_DATA: CustomerData[] = [
	{
		id: "1",
		name: "Victor Kenny",
		email: "designbyprose@gmail.com",
		phone: "+2349056113019",
		status: "Active",
		orders: 12,
	},
	{
		id: "2",
		name: "Kim Kim",
		email: "kimkim@gmail.com",
		phone: "+2349056117956",
		status: "Active",
		orders: 22,
	},
	{
		id: "3",
		name: "Ade Ogunremi",
		email: "adeogunremi234@gmail.com",
		phone: "+2347021323067",
		status: "Inactive",
		orders: 0,
	},
	{
		id: "4",
		name: "Gift Paul",
		email: "giftpaul234@gmail.com",
		phone: "+2348021903067",
		status: "Suspend",
		orders: 1,
	},
];

// --- Mock Data: Orders ---
const ORDER_DATA: OrderData[] = [
	{
		id: "1",
		orderId: "#OD4567",
		customer: "Victor Kenny",
		vendor: "Chicken Republic",
		rider: "James James",
		status: "Delivered",
	},
	{
		id: "2",
		orderId: "#OD4589",
		customer: "Ade Ade",
		vendor: "Chicken Republic",
		rider: "James James",
		status: "Picked up",
	},
	{
		id: "3",
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
				<Icon icon="ph:smiley-bold" className="text-secondary w-8 h-8" />
				<h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
			</div>

			{/* Tabs & Content Container */}
			<div className="bg-white p-6 rounded-[20px] shadow-sm border border-border/50 space-y-6">
				{/* Tabs Switcher */}
				<div className="bg-muted/30 p-1.5 rounded-full w-fit">
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
						<div className="flex flex-wrap gap-3 items-center">
							{/* Search Bar */}
							<div className="relative w-full sm:w-[250px]">
								<Icon
									icon="ph:magnifying-glass"
									className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5"
								/>
								<Input
									placeholder="Search"
									className="pl-10 h-10 rounded-lg border-border bg-white"
								/>
							</div>

							{/* Filter Buttons */}
							<Button
								variant="outline"
								className="h-10 w-10 p-0 rounded-lg border-border bg-white"
							>
								<Icon icon="ph:sliders-horizontal" width="20" />
							</Button>
							<Button
								variant="secondary"
								className="h-10 rounded-lg px-6 font-medium bg-[#FDB900] text-white hover:bg-[#e5a800]"
							>
								All
							</Button>
							<Button
								variant="outline"
								className="h-10 rounded-lg border-border bg-white px-4 font-medium"
							>
								A-Z
							</Button>
							<Button
								variant="outline"
								className="h-10 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[100px]"
							>
								status <Icon icon="ph:caret-down" className="ml-2" />
							</Button>
							<Button
								variant="outline"
								className="h-10 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[110px]"
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
							<h2 className="text-xl font-bold text-foreground mb-4">Live Orders</h2>
							<div className="flex flex-wrap gap-3">
								<Badge className="bg-secondary text-white hover:bg-secondary rounded-full px-3 py-1 font-normal">
									<span className="font-bold mr-1">3</span> In progress
								</Badge>
								<Badge className="bg-[#FF4500] text-white hover:bg-[#FF4500] rounded-full px-3 py-1 font-normal">
									<span className="font-bold mr-1">3</span> En route
								</Badge>
								<Badge className="bg-[#FDB900] text-white hover:bg-[#FDB900] rounded-full px-3 py-1 font-normal">
									<span className="font-bold mr-1">9</span> Pending
								</Badge>
								<Badge className="bg-[#FF6B6B] text-white hover:bg-[#FF6B6B] rounded-full px-3 py-1 font-normal">
									<span className="font-bold mr-1">2</span> Delayed
								</Badge>
								<Badge className="bg-[#A52A2A] text-white hover:bg-[#A52A2A] rounded-full px-3 py-1 font-normal">
									<span className="font-bold mr-1">0</span> Canceled
								</Badge>
							</div>
						</div>

						{/* Order Filters */}
						<div className="flex flex-wrap gap-3 items-center mt-4">
							<Button
								variant="outline"
								className="h-10 w-10 p-0 rounded-lg border-border bg-white"
							>
								<Icon icon="ph:sliders-horizontal" width="20" />
							</Button>
							<Button
								variant="outline"
								className="h-10 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[100px]"
							>
								status <Icon icon="ph:caret-down" className="ml-2" />
							</Button>
							<Button
								variant="outline"
								className="h-10 rounded-lg border-border bg-white px-4 font-medium"
							>
								Vendor
							</Button>
							<Button
								variant="outline"
								className="h-10 rounded-lg border-border bg-white px-4 font-medium"
							>
								Location
							</Button>
						</div>

						{/* Map Placeholder (Large gray area in design) */}
						<div className="w-full h-64 bg-[#F5F5F0] rounded-[20px] border border-border/20 flex items-center justify-center text-muted-foreground/30">
							{/* This represents the empty map/content area in your screenshot */}
						</div>

						{/* Legend (Bottom Right of map area in design) */}
						<div className="flex justify-end gap-4 text-[10px] text-foreground font-medium">
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 rounded-full bg-secondary"></div> Placed
							</div>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 rounded-full bg-blue-500"></div> Prepared
							</div>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 rounded-full bg-[#FDB900]"></div> Picked Up
							</div>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 rounded-full bg-green-700"></div> Delivered
							</div>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 rounded-full bg-destructive"></div> Canceled
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
