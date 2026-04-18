"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	riderEarningColumnsConfig,
} from "@/components/Tables/columns/RiderEarningColumns";
import { useRiderEarnings } from "@/hooks/financeManagement";
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

interface RiderEarningListProps {
	range?: "today" | "weekly" | "monthly";
}

export default function RiderEarningList({ range = "today" }: RiderEarningListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [sortBy, setSortBy] = useState("latest");

	const debouncedSearch = useDebounce(searchQuery, 500);

	const { data: earningResponse, isLoading } = useRiderEarnings({
		search: debouncedSearch,
		range,
		date: date ? format(date, "yyyy-MM-dd") : undefined,
	});

	const earningData = earningResponse?.data || [];

	const exportColumns = [
		{ header: "Rider Name", key: "name" },
		{ header: "Rider ID", key: "riderId" },
		{ header: "Completed Trips", key: "completedTrips" },
		{ header: "Today's Earnings", key: "todayEarnings" },
		{ header: "Period Earnings", key: "earnings" },
		{ header: "Period Payout", key: "payout" },
		{ header: "Incentives", key: "incentives" },
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
						placeholder="Search by Rider Name or ID"
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
					columns={getColumns(riderEarningColumnsConfig)} 
					data={earningData} 
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
					data={earningData} 
					columns={exportColumns} 
					filename={`Rider_Earnings_${range}_${date ? format(date, "yyyy-MM-dd") : "Full"}`}
					title={`Rider Earning Report - ${range.toUpperCase()}`}
				/>
			</div>
		</div>
	);
}
