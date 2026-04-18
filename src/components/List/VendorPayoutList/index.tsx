"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	vendorPayoutColumnsConfig,
} from "@/components/Tables/columns/VendorPayoutColumns";
import { useVendorPayouts } from "@/hooks/financeManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableExport from "@/components/_atoms/TableExport";

interface VendorPayoutListProps {
	range?: "today" | "weekly" | "monthly";
}

export default function VendorPayoutList({ range = "today" }: VendorPayoutListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [sortBy, setSortBy] = useState("latest");
	
	const debouncedSearch = useDebounce(searchQuery, 500);

	const { data: payoutResponse, isLoading } = useVendorPayouts({
		search: debouncedSearch,
		range,
		date: date ? format(date, "yyyy-MM-dd") : undefined,
	});

	const payoutData = payoutResponse?.data || [];

	const exportColumns = [
		{ header: "Vendor", key: "vendorName" },
		{ header: "Vendor ID", key: "vendorId" },
		{ header: "Order Volume", key: "orderVolume" },
		{ header: "Today's Earnings", key: "todayEarnings" },
		{ header: "Period Earnings", key: "earnings" },
		{ header: "Period Payout", key: "payout" },
		{ header: "Commission", key: "commission" },
		{ header: "Period Balance", key: "totalBalance" },
	];

	return (
		<div className="border-border w-full rounded-[20px] border bg-white p-6 shadow-sm">
			{/* Header / Filter Row */}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				<div className="relative w-full sm:w-[300px]">
					<Icon
						icon="lucide:search"
						className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
					/>
					<Input
						placeholder="Search by Vendor Name or ID"
						className="border-border h-10 rounded-lg bg-transparent pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className={cn(
								"border-border size-10 bg-transparent transition-colors",
								date && "border-primary bg-primary/5 text-primary"
							)}
						>
							<Icon icon="lucide:sliders-horizontal" className="size-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							initialFocus
							captionLayout="dropdown"
							fromYear={2020}
							toYear={2045}
						/>
						{date && (
							<div className="border-border border-t p-2">
								<Button 
									variant="ghost" 
									size="sm" 
									className="w-full text-xs"
									onClick={() => setDate(undefined)}
								>
									Clear Date Filter
								</Button>
							</div>
						)}
					</PopoverContent>
				</Popover>

				<Button 
					onClick={() => {
						setSearchQuery("");
						setDate(undefined);
					}}
					className="bg-accent hover:bg-accent/90 h-10 rounded-lg px-6 text-white"
				>
					All
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="border-border flex h-10 items-center gap-2 rounded-lg bg-transparent px-4 text-sm font-medium capitalize"
						>
							sort by: {sortBy} <Icon icon="lucide:chevron-down" className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setSortBy("latest")}>Latest</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setSortBy("earnings")}>Earnings</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setSortBy("payout")}>Payout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Table */}
			<div className="-mx-6">
				<DataTable 
					columns={getColumns(vendorPayoutColumnsConfig)} 
					data={payoutData} 
					isLoading={isLoading}
				/>
			</div>

			{/* Footer */}
			<div className="border-border mt-8 border-t pt-6">
				<div className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
					<Icon icon="lucide:download" className="size-4 text-secondary" />
					Download Report
				</div>
				<TableExport 
					data={payoutData} 
					columns={exportColumns} 
					filename={`Vendor_Payouts_${range}_${date ? format(date, "yyyy-MM-dd") : "Full"}`}
					title={`Vendor Payout Report - ${range.toUpperCase()}`}
				/>
			</div>
		</div>
	);
}
