// src/components/List/ActiveUserList/index.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { DataTable } from "@/components/Tables";
import {
	activeUsersColumnConfig,
	type ActiveUserData,
} from "@/components/Tables/columns/ActiveUsersColumnsConfig";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { ROUTES } from "@/constants/routes";

// --- Mock Data ---
// Corrected: RIDER_DATA now contains Riders
const RIDER_DATA: ActiveUserData[] = [
	{
		id: "1",
		name: "James James",
		userType: "Rider",
		userId: "RGHV0923",
		image: "",
		location: "Owode Market, Offa Kwara State",
		phone: "+2349056113019",
		status: "Active",
		activeOrder: "Yes",
		rating: 5.0,
	},
	{
		id: "2",
		name: "James James",
		userType: "Rider",
		userId: "RGHV0923",
		image: "",
		location: "Owode Market, Offa Kwara State",
		phone: "+2349056113019",
		status: "Active",
		activeOrder: "No",
		rating: 5.0,
	},
];

// Corrected: VENDOR_DATA now contains Vendors
const VENDOR_DATA: ActiveUserData[] = [
	{
		id: "1",
		name: "Item 7 Go",
		userType: "Vendor",
		userId: "VGHV0923",
		image: "",
		location: "Owode Market, Offa Kwara State",
		phone: "+2349056113019",
		status: "Online",
		activeOrder: 12,
		rating: 5.0,
	},
	{
		id: "2",
		name: "Unique Restaurant",
		userType: "Vendor",
		userId: "VGHV0923",
		image: "",
		location: "Owode Market, Offa Kwara State",
		phone: "+2349056113019",
		status: "Online",
		activeOrder: 0,
		rating: 5.0,
	},
];

const TAB_ITEMS: TabItem[] = [
	{ id: "riders", label: "Online Riders" },
	{ id: "vendors", label: "Online Vendor" },
];

export default function ActiveUserList() {
	const [activeTab, setActiveTab] = useState("riders");

	// Determine data based on tab
	const currentData = activeTab === "riders" ? RIDER_DATA : VENDOR_DATA;

	// Dynamic Page Title Logic
	const pageTitle = activeTab === "riders" ? "Active Rider" : "Active Vendor";

	const columns = getColumns(activeUsersColumnConfig);

	return (
		<div className="w-full space-y-6">
			{/* Header / Title Section */}
			<div className="flex items-center justify-between">
				<h1 className="text-foreground text-2xl font-bold transition-all duration-300 ease-in-out">
					{pageTitle}
				</h1>

				{/* Back Button with Centralized Routing */}
				<Link href={ROUTES.DASHBOARD}>
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-muted border-border rounded-full border bg-white shadow-sm"
					>
						<Icon icon="ph:arrow-u-up-left-bold" width="20" />
					</Button>
				</Link>
			</div>

			{/* Tabs & Filters Container */}
			<div className="border-border/50 space-y-6 rounded-[20px] border bg-white p-6 shadow-sm">
				{/* Tabs */}
				<div className="bg-muted/30 w-fit rounded-full p-1.5">
					<CustomTabs
						items={TAB_ITEMS}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>
				</div>

				{/* Filters Row */}
				<div className="flex flex-wrap gap-3">
					<Button
						variant="outline"
						className="border-border size-10 rounded-lg bg-white p-0"
					>
						<Icon icon="ph:sliders-horizontal" width="20" />
					</Button>

					{/* Filter Dropdowns (Visual only for now) */}
					{["Status", "Location", "Ratings"].map((label) => (
						<Button
							key={label}
							variant="outline"
							className="border-border h-10 min-w-[100px] justify-between rounded-lg bg-white px-4 text-sm font-medium"
						>
							{label}
							<Icon icon="ph:caret-down" className="text-muted-foreground ml-2" />
						</Button>
					))}
				</div>

				{/* Table */}
				<DataTable columns={columns} data={currentData} title="" />
			</div>
		</div>
	);
}
