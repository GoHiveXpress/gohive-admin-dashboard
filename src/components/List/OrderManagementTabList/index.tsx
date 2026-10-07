"use client";

/* eslint-disable no-nested-ternary */

import { useState, useMemo } from "react";
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
import { useOrders, useOrderStats } from "@/hooks/customerManagement";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import GoogleRoutesMap from "@/components/Map/GoogleRoutesMap";

export default function OrderManagementTabList() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
	const [status, setStatus] = useState<string>("all");
	const [search, setSearch] = useState("");
	const [sortMode, setSortMode] = useState<"asc" | "desc" | null>(null);
	const [vendorId, setVendorId] = useState<string>("all");

	const { data: orderResponse, isLoading, error } = useOrders({ status, search });
	const { data: statsResponse } = useOrderStats();

	const orders = orderResponse?.data ?? [];
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

	// Vendors that appear in the loaded orders, for the Vendor filter
	const vendors = useMemo(() => {
		const byId = new Map<string, string>();
		orders.forEach((order: any) => {
			const id = order.vendor?._id;
			if (id) byId.set(id, order.vendor?.vendorProfile?.businessName || "Unnamed vendor");
		});
		return Array.from(byId, ([id, name]) => ({ id, name })).sort((a, b) =>
			a.name.localeCompare(b.name),
		);
	}, [orders]);

	const processedOrders = useMemo(() => {
		const result =
			vendorId === "all"
				? [...orders]
				: orders.filter((order: any) => order.vendor?._id === vendorId);
		if (sortMode === "asc") {
			result.sort((a, b) => (a.customer?.name || "").localeCompare(b.customer?.name || ""));
		} else if (sortMode === "desc") {
			result.sort((a, b) => (b.customer?.name || "").localeCompare(a.customer?.name || ""));
		}
		return result;
	}, [orders, sortMode, vendorId]);

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
						onChange={(e) => setSearch(e.target.value)}
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
						<DropdownMenuCheckboxItem
							checked={status === "placed"}
							onCheckedChange={() => setStatus("placed")}
						>
							Placed
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "accepted"}
							onCheckedChange={() => setStatus("accepted")}
						>
							Accepted
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "preparing"}
							onCheckedChange={() => setStatus("preparing")}
						>
							Preparing
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "ready"}
							onCheckedChange={() => setStatus("ready")}
						>
							Ready
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "picked_up"}
							onCheckedChange={() => setStatus("picked_up")}
						>
							Picked up
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
						<DropdownMenuCheckboxItem
							checked={status === "rejected"}
							onCheckedChange={() => setStatus("rejected")}
						>
							Rejected
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "pending"}
							onCheckedChange={() => setStatus("pending")}
						>
							Awaiting payment
						</DropdownMenuCheckboxItem>
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
				<DataTable
					columns={getColumns(getCustomerOrderManagementColumns(handleViewOrder))}
					data={processedOrders}
					title=""
				/>
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
