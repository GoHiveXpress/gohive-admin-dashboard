/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { orderHistoryColumns } from "@/components/Tables/columns/orderHistoryColumns";
import { useCustomerOrders, useOrders } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";
import GoogleRoutesMap from "@/components/Map/GoogleRoutesMap";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function OrderHistoryList({ customerId }: { customerId?: string }) {
	const {
		data: customerOrdersResponse,
		isLoading: isCustomerOrdersLoading,
		error: customerOrdersError,
	} = useCustomerOrders(customerId!);

	const {
		data: allOrdersResponse,
		isLoading: isAllOrdersLoading,
		error: allOrdersError,
	} = useOrders({}); // General list could use filters, but for now empty

	const [status, setStatus] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortMode, setSortMode] = useState<"asc" | "desc" | null>(null);
	const [dateFilter, setDateFilter] = useState<string>("all-time");

	const isLoading = customerId ? isCustomerOrdersLoading : isAllOrdersLoading;
	const error = customerId ? customerOrdersError : allOrdersError;
	const sourceOrders = customerId ? customerOrdersResponse?.data : allOrdersResponse?.data;
	const orders = sourceOrders || [];

	const processedOrders = useMemo(() => {
		let result = [...orders];

		if (searchQuery.trim() !== "") {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(item: any) =>
					item._id?.toLowerCase().includes(query) ||
					item.customer?.name?.toLowerCase().includes(query)
			);
		}

		if (status !== "all") {
			result = result.filter((item: any) => item.status === status);
		}

		if (dateFilter !== "all-time") {
			const now = new Date();
			result = result.filter((item: any) => {
				if (!item.createdAt) return false;
				const itemDate = new Date(item.createdAt);
				if (dateFilter === "today") {
					return itemDate.toDateString() === now.toDateString();
				}
				if (dateFilter === "week") {
					const sevenDaysAgo = new Date(now);
					sevenDaysAgo.setDate(now.getDate() - 7);
					sevenDaysAgo.setHours(0, 0, 0, 0);
					return itemDate >= sevenDaysAgo;
				}
				if (dateFilter === "month") {
					const thirtyDaysAgo = new Date(now);
					thirtyDaysAgo.setDate(now.getDate() - 30);
					thirtyDaysAgo.setHours(0, 0, 0, 0);
					return itemDate >= thirtyDaysAgo;
				}
				return true;
			});
		}

		if (sortMode === "asc") {
			result.sort((a: any, b: any) => (a.customer?.name || "").localeCompare(b.customer?.name || ""));
		} else if (sortMode === "desc") {
			result.sort((a: any, b: any) => (b.customer?.name || "").localeCompare(a.customer?.name || ""));
		}

		return result;
	}, [orders, searchQuery, sortMode, status, dateFilter]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-destructive p-8 text-center">Failed to load order history.</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filters Section */}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				{/* Search */}
				<div className="relative w-full sm:w-64">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search History"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="border-border h-10 rounded-lg bg-white pl-10"
					/>
				</div>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="border-border relative size-10 shrink-0 rounded-lg bg-white p-0"
						>
							<Icon icon="ph:sliders-horizontal" className="size-5" />
							{status !== "all" && (
								<span className="absolute right-0 top-0 size-2 rounded-full bg-[#F97316]" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 z-50 bg-white">
						<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem
							checked={status === "all"}
							onCheckedChange={() => setStatus("all")}
						>
							All Statuses
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "delivered"}
							onCheckedChange={() => setStatus("delivered")}
						>
							Delivered
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "cancelled"}
							onCheckedChange={() => setStatus("cancelled")}
						>
							Cancelled
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Quick Filters */}
				<Button
					onClick={() => {
						setStatus("all");
						setDateFilter("all-time");
					}}
					className={cn(
						"h-10 rounded-lg px-6 font-medium transition-colors",
						status === "all" && dateFilter === "all-time"
							? "bg-[#F97316] text-white hover:bg-[#F97316]/90"
							: "border-border bg-white text-foreground hover:bg-muted/80"
					)}
				>
					All
				</Button>

				<Button
					variant={sortMode !== null ? "default" : "outline"}
					onClick={() => setSortMode((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"))}
					className={cn(
						"h-10 rounded-lg bg-white px-4 font-medium",
						sortMode !== null ? "bg-[#123614] text-white hover:bg-[#123614]/90" : "border-border"
					)}
				>
					A-Z {sortMode === "asc" ? "↓" : sortMode === "desc" ? "↑" : ""}
				</Button>

				<div className="bg-border mx-1 hidden h-6 w-px sm:block" />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="border-border h-10 min-w-[120px] justify-between rounded-lg bg-white">
							{dateFilter === "all-time" ? "Date" : dateFilter === "today" ? "Today" : dateFilter === "week" ? "Last 7 Days" : "Last 30 Days"}
							<Icon icon="ph:caret-down" className="ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 z-50 bg-white">
						<DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem checked={dateFilter === "all-time"} onCheckedChange={() => setDateFilter("all-time")}>All Time</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={dateFilter === "today"} onCheckedChange={() => setDateFilter("today")}>Today</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={dateFilter === "week"} onCheckedChange={() => setDateFilter("week")}>Last 7 Days</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={dateFilter === "month"} onCheckedChange={() => setDateFilter("month")}>Last 30 Days</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Google Map Tracker for Orders */}
			<div className="w-full mb-6">
				<GoogleRoutesMap orders={orders || []} />
			</div>

			{/* Table - Modal/Action removed */}
			<DataTable columns={getColumns(orderHistoryColumns)} data={processedOrders} title="" />
		</div>
	);
}

/* eslint-enable */
