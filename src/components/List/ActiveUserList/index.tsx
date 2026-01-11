// src/components/List/ActiveUserList/index.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import CustomTabs, { TabItem } from "@/components/Tabs";
import { DataTable } from "@/components/Tables";
import {
	activeUsersColumnConfig,
	ActiveUserData,
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
				<h1 className="text-2xl font-bold text-foreground transition-all duration-300 ease-in-out">
					{pageTitle}
				</h1>

				{/* Back Button with Centralized Routing */}
				<Link href={ROUTES.DASHBOARD}>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full bg-white hover:bg-muted shadow-sm border border-border"
					>
						<Icon icon="ph:arrow-u-up-left-bold" width="20" />
					</Button>
				</Link>
			</div>

			{/* Tabs & Filters Container */}
			<div className="bg-white p-6 rounded-[20px] shadow-sm border border-border/50 space-y-6">
				{/* Tabs */}
				<div className="bg-muted/30 p-1.5 rounded-full w-fit">
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
						className="h-10 w-10 p-0 rounded-lg border-border bg-white"
					>
						<Icon icon="ph:sliders-horizontal" width="20" />
					</Button>

					{/* Filter Dropdowns (Visual only for now) */}
					{["Status", "Location", "Ratings"].map((label) => (
						<Button
							key={label}
							variant="outline"
							className="h-10 rounded-lg border-border bg-white px-4 text-sm font-medium justify-between min-w-[100px]"
						>
							{label}
							<Icon icon="ph:caret-down" className="ml-2 text-muted-foreground" />
						</Button>
					))}
				</div>

				{/* Table */}
				<DataTable columns={columns} data={currentData} title="" />
			</div>
		</div>
	);
}
