"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useMemo, useState } from "react";
import { useVendorLeaderboard } from "@/hooks/analytics";
import { useVendors, useVendorCategories } from "@/hooks/vendorManagement";
import { DataTable } from "@/components/Tables";
import {
	vendorsColumnConfig,
} from "@/components/Tables/columns/VendorsColumnsConfig";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TopVendorsList() {
	const [category, setCategory] = useState<string>("all");
	const [sort, setSort] = useState<string>("default");
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [shouldFetchLeaderboard, setShouldFetchLeaderboard] = useState(false);

	useEffect(() => {
		const timer = window.setTimeout(() => setShouldFetchLeaderboard(true), 700);
		return () => window.clearTimeout(timer);
	}, []);

	// Fetch dynamic data for filters
	const { data: categoriesData } = useVendorCategories();

	// Use real categories from backend (storing both title and value)
	const dynamicCategories = useMemo(() => {
		return (categoriesData?.data || []).map((c: any) => ({
			title: c.title,
			value: c.value,
		}));
	}, [categoriesData]);

	const filterParams = useMemo(() => {
		const rawParams = {
			category: category === "all" ? undefined : category,
			sort: sort === "default" ? undefined : sort,
			start_date: date ? format(date, "yyyy-MM-dd") : undefined,
			end_date: date ? format(date, "yyyy-MM-dd") : undefined,
			range: date ? undefined : "all_time",
		};
		// Filter out undefined values to prevent "undefined" string in query
		return Object.fromEntries(
			Object.entries(rawParams).filter(([_, v]) => v !== undefined)
		);
	}, [category, sort, date]);

	const { data: leaderboardData, isLoading, error } = useVendorLeaderboard(
		filterParams,
		shouldFetchLeaderboard,
	);
	const columns = getColumns(vendorsColumnConfig);
	
	// Professional Mapping with fallbacks to avoid crashes
	const tableData = useMemo(() => {
		const rawData = leaderboardData?.data || [];

		return rawData.map((item: any) => ({
			...item,
			name: item.vendorName || item.name || "Unknown Vendor",
			totalOrder: item.totalOrders || item.totalOrder || 0,
			avgRating: item.avgRating || 0,
			location: item.location || "N/A",
			category: item.category || "General",
			// Defensive check for trend to avoid toLowerCase() crash
			trend: (item.trend || "stable").toLowerCase(),
			// Backend doesn't return image yet, using a standard placeholder logic
			image: item.image || "", 
		}));
	}, [leaderboardData]);

	const resetFilters = () => {
		setCategory("all");
		setSort("default");
		setDate(undefined);
	};

	return (
		<div className="w-full">
			<div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h2 className="text-foreground text-xl font-bold">Top Vendors</h2>
				<div className="flex flex-wrap gap-2">
					{/* Calendar Filter POPPER DESIGN */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className={cn(
									"border-border size-9 bg-white p-0 transition-colors",
									date && "border-secondary bg-secondary/5 text-secondary"
								)}
							>
								<Icon icon="ph:sliders-horizontal" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={date}
								onSelect={setDate}
								initialFocus
							/>
							{date && (
								<div className="border-t p-2">
									<Button 
										variant="ghost" 
										size="sm" 
										className="w-full text-xs"
										onClick={() => setDate(undefined)}
									>
										Clear Date
									</Button>
								</div>
							)}
						</PopoverContent>
					</Popover>

					{/* ALL BUTTON */}
					<Button
						variant="outline"
						size="sm"
						onClick={resetFilters}
						className={cn(
							"h-9 px-4 font-medium",
							category === "all" && sort === "default" && !date
								? "bg-primary text-foreground border-none"
								: "bg-white border-border"
						)}
					>
						All
					</Button>

					{/* CATEGORIES DROPDOWN */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className={cn(
									"border-border h-9 min-w-[120px] justify-between bg-white px-3 text-xs font-medium",
									category !== "all" && "border-secondary text-secondary"
								)}
							>
								{category === "all" ? "Categories" : 
									dynamicCategories.find(c => c.value === category)?.title || category
								} <Icon icon="ph:caret-down" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="bg-white">
							<DropdownMenuItem onClick={() => setCategory("all")}>All Categories</DropdownMenuItem>
							{dynamicCategories.map((cat) => (
								<DropdownMenuItem key={cat.value} onClick={() => setCategory(cat.value)}>
									{cat.title}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* TRENDS DROPDOWN */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className={cn(
									"border-border h-9 min-w-[110px] justify-between bg-white px-3 text-xs font-medium",
									sort !== "default" && "border-secondary text-secondary"
								)}
							>
								{sort === "default" ? "Trends" : sort === "revenue" ? "Revenue" : "Orders"} <Icon icon="ph:caret-down" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="bg-white">
							<DropdownMenuItem onClick={() => setSort("default")}>Default (Rating)</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setSort("revenue")}>Highest Revenue</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setSort("orders")}>Most Orders</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{error ? (
				<div className="bg-destructive/10 text-destructive flex flex-col items-center justify-center gap-2 rounded-lg p-8">
					<Icon icon="ph:warning-circle-bold" className="size-8" />
					<p className="font-medium">Failed to load top vendors</p>
					<Button 
						variant="outline" 
						size="sm" 
						onClick={() => window.location.reload()}
						className="mt-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
					>
						Retry
					</Button>
				</div>
			) : isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-16 w-full rounded-lg" />
					))}
				</div>
			) : (
				<DataTable columns={columns} data={tableData} />
			)}
		</div>
	);
}

/* eslint-enable */
