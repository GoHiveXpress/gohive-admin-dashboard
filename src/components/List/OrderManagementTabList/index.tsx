"use client";

/* eslint-disable no-nested-ternary */

import { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	getCustomerOrderManagementColumns,
	type OrderData,
} from "@/components/Tables/columns/customerOrderManagementColumns";
import OrderProcessModal from "@/components/_modals/OrderProcessModal";
import { usePaginatedOrders, useOrderStats } from "@/hooks/customerManagement";
import { useVendors } from "@/hooks/vendorManagement";
import { type VendorUser } from "@/types/vendorManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";
import TablePagination from "@/components/Tables/Pagination";
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
import GoogleRoutesMap from "@/components/Map/GoogleRoutesMap";

const PAGE_SIZE = 20;

export default function OrderManagementTabList() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
	const [status, setStatusState] = useState<string>("all");
	const [search, setSearch] = useState("");
	const [sortMode, setSortMode] = useState<"asc" | "desc" | null>(null);
	const [vendorId, setVendorIdState] = useState<string>("all");
	const [page, setPage] = useState(1);
	const { can } = usePermissions();

	// Links from the detail panel arrive as /order-management?search=<code>.
	useEffect(() => {
		const initial = new URLSearchParams(window.location.search).get("search");
		if (initial) setSearch(initial);
	}, []);

	// Search, status and vendor filter on the server, one page at a time.
	const debouncedSearch = useDebounce(search.trim(), 400);
	const {
		data: orderResponse,
		isLoading,
		isFetching,
		error,
	} = usePaginatedOrders({
		status,
		search: debouncedSearch,
		vendor: vendorId === "all" ? undefined : vendorId,
		page,
		limit: PAGE_SIZE,
	});
	const { data: statsResponse } = useOrderStats();
	// The full vendor list needs Vendor Management; without it the filter falls
	// back to the vendors on the loaded page.
	const canListVendors = can(PERMISSIONS.VENDORS);
	// A-Z and capped at the server's page maximum, so it never downloads every vendor
	const { data: vendorsResponse } = useVendors(
		{ sort: "name_asc", page: 1, limit: 200 },
		{ enabled: canListVendors },
	);

	const orders = useMemo(() => orderResponse?.data ?? [], [orderResponse]);

	const setStatus = (value: string) => {
		setStatusState(value);
		setPage(1);
	};
	const setVendorId = (value: string) => {
		setVendorIdState(value);
		setPage(1);
	};
	const stats = statsResponse?.data ?? {
		pending: 0,
		payment_failed: 0,
		placed: 0,
		accepted: 0,
		preparing: 0,
		ready: 0,
		picked_up: 0,
		delivered: 0,
		rejected: 0,
		cancelled: 0,
		expired: 0,
	};

	// Options for the Vendor filter
	const vendors = useMemo(() => {
		const byId = new Map<string, string>();
		(canListVendors ? (vendorsResponse?.data ?? []) : []).forEach((vendor: VendorUser) => {
			if (vendor?._id) {
				byId.set(
					vendor._id,
					vendor.vendorProfile?.businessName || vendor.name || "Unnamed vendor",
				);
			}
		});
		orders.forEach((order) => {
			const id = order.vendor?._id;
			if (id) byId.set(id, order.vendor?.vendorProfile?.businessName || "Unnamed vendor");
		});
		return Array.from(byId, ([id, name]) => ({ id, name })).sort((a, b) =>
			a.name.localeCompare(b.name),
		);
	}, [orders, vendorsResponse, canListVendors]);

	// A-Z sorts the current page only; order across pages is newest first.
	const processedOrders = useMemo(() => {
		const result = [...orders];
		if (sortMode === "asc") {
			result.sort((a, b) => (a.customer?.name || "").localeCompare(b.customer?.name || ""));
		} else if (sortMode === "desc") {
			result.sort((a, b) => (b.customer?.name || "").localeCompare(a.customer?.name || ""));
		}
		return result;
	}, [orders, sortMode]);

	const handleViewOrder = (order: OrderData) => {
		setSelectedOrder(order);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedOrder(null);
	};

	return (
		<div className="space-y-6">
			{/* Live Orders Stats Header */}
			<div>
				<h2 className="text-foreground mb-4 text-xl font-bold">Live Orders</h2>
				<div className="flex flex-wrap gap-2">
					<Badge className="rounded-full bg-[#FDB900] px-3 py-1 text-[10px] font-normal text-white hover:bg-[#FDB900]">
						<span className="mr-1 font-bold">{stats.pending}</span> pending
					</Badge>
					<Badge className="bg-destructive hover:bg-destructive rounded-full px-3 py-1 text-[10px] font-normal text-white">
						<span className="mr-1 font-bold">{stats.payment_failed}</span>{" "}
						payment_failed
					</Badge>
					<Badge className="bg-secondary hover:bg-secondary rounded-full px-3 py-1 text-[10px] font-normal text-white">
						<span className="mr-1 font-bold">{stats.placed}</span> placed
					</Badge>
					<Badge className="rounded-full bg-green-600 px-3 py-1 text-[10px] font-normal text-white hover:bg-green-600">
						<span className="mr-1 font-bold">{stats.accepted}</span> accepted
					</Badge>
					<Badge className="rounded-full bg-blue-500 px-3 py-1 text-[10px] font-normal text-white hover:bg-blue-500">
						<span className="mr-1 font-bold">{stats.preparing}</span> preparing
					</Badge>
					<Badge className="rounded-full bg-cyan-500 px-3 py-1 text-[10px] font-normal text-white hover:bg-cyan-500">
						<span className="mr-1 font-bold">{stats.ready}</span> ready
					</Badge>
					<Badge className="rounded-full bg-[#FF4500] px-3 py-1 text-[10px] font-normal text-white hover:bg-[#FF4500]">
						<span className="mr-1 font-bold">{stats.picked_up}</span> picked_up
					</Badge>
					<Badge className="rounded-full bg-green-700 px-3 py-1 text-[10px] font-normal text-white hover:bg-green-700">
						<span className="mr-1 font-bold">{stats.delivered}</span> delivered
					</Badge>
					<Badge className="rounded-full bg-rose-700 px-3 py-1 text-[10px] font-normal text-white hover:bg-rose-700">
						<span className="mr-1 font-bold">{stats.rejected}</span> rejected
					</Badge>
					<Badge className="rounded-full bg-[#A52A2A] px-3 py-1 text-[10px] font-normal text-white hover:bg-[#A52A2A]">
						<span className="mr-1 font-bold">{stats.cancelled}</span> cancelled
					</Badge>
					<Badge className="rounded-full bg-gray-500 px-3 py-1 text-[10px] font-normal text-white hover:bg-gray-500">
						<span className="mr-1 font-bold">{stats.expired}</span> expired
					</Badge>
				</div>
			</div>

			{/* Order Filters */}
			<div className="mt-4 flex flex-wrap items-center gap-3">
				{/* Search */}
				<div className="relative w-full sm:w-64">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search Orders"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className="border-border h-10 rounded-lg bg-white pl-10"
					/>
				</div>

				{/* Filter Button Dropdown */}
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
						setVendorId("all");
					}}
					className={cn(
						"h-10 rounded-lg px-6 font-medium transition-colors",
						status === "all"
							? "bg-[#F97316] text-white hover:bg-[#F97316]/90"
							: "border-border bg-white text-foreground hover:bg-muted/80",
					)}
				>
					All
				</Button>

				<Button
					variant={sortMode !== null ? "default" : "outline"}
					title="Sorts the orders on this page by customer name"
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
							className={cn(
								"border-border h-10 max-w-[220px] rounded-lg bg-white px-4 font-medium",
								vendorId !== "all" && "border-[#F97316] text-[#F97316]",
							)}
						>
							<span className="truncate">
								{vendors.find((v) => v.id === vendorId)?.name ?? "Vendor"}
							</span>
							<Icon icon="ph:caret-down" className="ml-2 shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="max-h-80 w-56 overflow-y-auto">
						<DropdownMenuLabel>Filter by vendor</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem
							checked={vendorId === "all"}
							onCheckedChange={() => setVendorId("all")}
						>
							All vendors
						</DropdownMenuCheckboxItem>
						{vendors.map((vendor) => (
							<DropdownMenuCheckboxItem
								key={vendor.id}
								checked={vendorId === vendor.id}
								onCheckedChange={() => setVendorId(vendor.id)}
							>
								{vendor.name}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Google Map Tracker for Active Orders */}
			<div className="w-full">
				<GoogleRoutesMap orders={orders} />
			</div>

			{/* Legend */}
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

			{/* Orders Table with Action Column */}
			{isLoading ? (
				<div className="flex h-64 w-full items-center justify-center">
					<Icon
						icon="line-md:loading-one-column-up-loop"
						className="text-secondary size-10"
					/>
				</div>
			) : error ? (
				<div className="text-destructive flex h-64 w-full items-center justify-center font-medium">
					Failed to load orders.
				</div>
			) : (
				<div className={cn(isFetching && "opacity-60 transition-opacity")}>
					<DataTable
						columns={getColumns(getCustomerOrderManagementColumns(handleViewOrder))}
						data={processedOrders}
						title=""
					/>
					<TablePagination
						pagination={orderResponse?.pagination}
						onPageChange={setPage}
						isFetching={isFetching}
						itemLabel="orders"
					/>
				</div>
			)}

			{/* Modal */}
			<OrderProcessModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				data={selectedOrder}
			/>
		</div>
	);
}

/* eslint-enable */
