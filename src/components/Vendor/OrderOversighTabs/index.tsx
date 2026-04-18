// src/components/Vendor/OrderOversighTabs/index.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import LiveOrderVendorCards from "@/components/cards/LiveOrderVendorCards";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrderOversightTabs() {
	const [searchQuery, setSearchQuery] = useState("");
	const [status, setStatus] = useState<string>("all");
	const [dateFilter, setDateFilter] = useState<string>("all");
	return (
		<div className="w-full">
			{/* Order Oversight Specific Filters */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Search Bar */}
				<div className="relative w-full sm:w-[300px]">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search by Vendor or Order ID"
						className="border-border h-12 rounded-lg bg-white pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				{/* Filter Icon Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="border-border relative size-12 shrink-0 rounded-lg bg-white p-0"
						>
							<Icon icon="ph:sliders-horizontal" className="size-5" />
							{status !== "all" && (
								<span className="absolute right-0 top-0 size-2 rounded-full bg-[#F97316]" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-56 z-50 bg-white">
						<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem checked={status === "all"} onCheckedChange={() => setStatus("all")}>All Orders</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "pending"} onCheckedChange={() => setStatus("pending")}>Pending</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "placed"} onCheckedChange={() => setStatus("placed")}>Placed</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "accepted"} onCheckedChange={() => setStatus("accepted")}>Accepted</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "preparing"} onCheckedChange={() => setStatus("preparing")}>Preparing</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "ready"} onCheckedChange={() => setStatus("ready")}>Ready</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "picked_up"} onCheckedChange={() => setStatus("picked_up")}>Picked Up</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "delivered"} onCheckedChange={() => setStatus("delivered")}>Delivered</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "payment_failed"} onCheckedChange={() => setStatus("payment_failed")}>Payment Failed</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "rejected"} onCheckedChange={() => setStatus("rejected")}>Rejected</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "cancelled"} onCheckedChange={() => setStatus("cancelled")}>Cancelled</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={status === "expired"} onCheckedChange={() => setStatus("expired")}>Expired</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* All Quick-Reset */}
				<Button
					onClick={() => {
						setStatus("all");
						setDateFilter("all");
					}}
					className={cn(
						"h-12 rounded-lg px-6 font-medium transition-colors",
						status === "all" && dateFilter === "all"
							? "bg-primary text-primary-foreground hover:bg-primary/90"
							: "border-border bg-white text-foreground hover:bg-muted/80"
					)}
				>
					All
				</Button>

				{/* Date Filter */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="border-border h-12 min-w-[130px] justify-between rounded-lg bg-white px-6 font-medium">
							{dateFilter === "all" ? "Date" : dateFilter === "today" ? "Today" : dateFilter === "week" ? "Last 7 Days" : "Last 30 Days"}
							<Icon icon="ph:caret-down" className="ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 z-50 bg-white">
						<DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem checked={dateFilter === "all"} onCheckedChange={() => setDateFilter("all")}>All Time</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={dateFilter === "today"} onCheckedChange={() => setDateFilter("today")}>Today</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={dateFilter === "week"} onCheckedChange={() => setDateFilter("week")}>Last 7 Days</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={dateFilter === "month"} onCheckedChange={() => setDateFilter("month")}>Last 30 Days</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Live Orders Section */}
			<LiveOrderVendorCards searchQuery={searchQuery} status={status} dateFilter={dateFilter} />
		</div>
	);
}
