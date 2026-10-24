// Untyped screen written before the lint rules; only its data source changed here.

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/prefer-nullish-coalescing, no-nested-ternary */
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/Tables";
import TablePagination from "@/components/Tables/Pagination";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { orderHistoryColumns } from "@/components/Tables/columns/orderHistoryColumns";
import { useCustomerOrders, usePaginatedOrders } from "@/hooks/customerManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import GoogleRoutesMap from "@/components/Map/GoogleRoutesMap";
import { useEffect, useState, useMemo } from "react";
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
import { ORDER_STATUS_OPTIONS } from "@/lib/orderStatus";

const PAGE_SIZE = 20;

export default function OrderHistoryList({ customerId }: { customerId?: string }) {
	const [status, setStatus] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortMode, setSortMode] = useState<"asc" | "desc" | null>(null);
	const [dateFilter, setDateFilter] = useState<string>("all-time");
	const [page, setPage] = useState(1);
	const debouncedSearch = useDebounce(searchQuery.trim(), 400);

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, status, dateFilter]);

	// One customer's orders are few, so their page loads them all and filters here
	const {
		data: customerOrdersResponse,
		isLoading: isCustomerOrdersLoading,
		error: customerOrdersError,
	} = useCustomerOrders(customerId!);

	// Every order on the platform: the server filters and pages them
	const {
		data: allOrdersResponse,
		isLoading: isAllOrdersLoading,
		isFetching: isAllOrdersFetching,
		error: allOrdersError,
	} = usePaginatedOrders(
		{
			search: debouncedSearch || undefined,
			status: status === "all" ? undefined : status,
			range:
				dateFilter === "all-time" ? undefined : (dateFilter as "today" | "week" | "month"),
			page,
			limit: PAGE_SIZE,
		},
		{ enabled: !customerId },
	);

	const isLoading = customerId ? isCustomerOrdersLoading : isAllOrdersLoading;
	const error = customerId ? customerOrdersError : allOrdersError;
	const sourceOrders = customerId ? customerOrdersResponse?.data : allOrdersResponse?.data;
	const orders = sourceOrders || [];

	const processedOrders = useMemo(() => {
		let result = [...orders];
		// The server already applied search, status and date to the all-orders list
		const filterHere = Boolean(customerId);

		if (filterHere && searchQuery.trim() !== "") {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(item: any) =>
					item.orderId?.toLowerCase().includes(query.replace(/^#/, "")) ||
					item._id?.toLowerCase().includes(query) ||
					item.customer?.name?.toLowerCase().includes(query),
			);
		}

		if (filterHere && status !== "all") {
			result = result.filter((item: any) => item.status === status);
		}

		if (filterHere && dateFilter !== "all-time") {
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
			result.sort((a: any, b: any) =>
				(a.customer?.name || "").localeCompare(b.customer?.name || ""),
			);
		} else if (sortMode === "desc") {
			result.sort((a: any, b: any) =>
				(b.customer?.name || "").localeCompare(a.customer?.name || ""),
			);
		}

		return result;
	}, [orders, customerId, searchQuery, sortMode, status, dateFilter]);

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
					<DropdownMenuContent align="start" className="z-50 w-48 bg-white">
						<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem
							checked={status === "all"}
							onCheckedChange={() => setStatus("all")}
						>
							All Statuses
						</DropdownMenuCheckboxItem>
						{ORDER_STATUS_OPTIONS.map((option) => (
							<DropdownMenuCheckboxItem
								key={option.value}
								checked={status === option.value}
								onCheckedChange={() => setStatus(option.value)}
							>
								{option.label}
							</DropdownMenuCheckboxItem>
						))}
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
							: "border-border bg-white text-foreground hover:bg-muted/80",
					)}
				>
					All
				</Button>

				<Button
					variant={sortMode !== null ? "default" : "outline"}
					onClick={() =>
						setSortMode((prev) =>
							prev === "asc" ? "desc" : prev === "desc" ? null : "asc",
						)
					}
					className={cn(
						"h-10 rounded-lg bg-white px-4 font-medium",
						sortMode !== null
							? "bg-[#123614] text-white hover:bg-[#123614]/90"
							: "border-border",
					)}
				>
					A-Z {sortMode === "asc" ? "↓" : sortMode === "desc" ? "↑" : ""}
				</Button>

				<div className="bg-border mx-1 hidden h-6 w-px sm:block" />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="border-border h-10 min-w-[120px] justify-between rounded-lg bg-white"
						>
							{dateFilter === "all-time"
								? "Date"
								: dateFilter === "today"
									? "Today"
									: dateFilter === "week"
										? "Last 7 Days"
										: "Last 30 Days"}
							<Icon icon="ph:caret-down" className="ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="z-50 w-48 bg-white">
						<DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem
							checked={dateFilter === "all-time"}
							onCheckedChange={() => setDateFilter("all-time")}
						>
							All Time
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={dateFilter === "today"}
							onCheckedChange={() => setDateFilter("today")}
						>
							Today
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={dateFilter === "week"}
							onCheckedChange={() => setDateFilter("week")}
						>
							Last 7 Days
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={dateFilter === "month"}
							onCheckedChange={() => setDateFilter("month")}
						>
							Last 30 Days
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Google Map Tracker for Orders */}
			<div className="mb-6 w-full">
				<GoogleRoutesMap orders={orders || []} />
			</div>

			{/* Table - Modal/Action removed */}
			<div
				className={cn(
					!customerId && isAllOrdersFetching && "opacity-60 transition-opacity",
				)}
			>
				<DataTable
					columns={getColumns(orderHistoryColumns)}
					data={processedOrders}
					title=""
				/>
				{!customerId && (
					<TablePagination
						pagination={allOrdersResponse?.pagination}
						onPageChange={setPage}
						isFetching={isAllOrdersFetching}
						itemLabel="orders"
					/>
				)}
			</div>
		</div>
	);
}

/* eslint-enable */
