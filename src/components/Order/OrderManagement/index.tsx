"use client";

/* eslint-disable jsx-a11y/aria-role */

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { usePaginatedOrders } from "@/hooks/customerManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_OPTIONS, orderStatusLabel } from "@/lib/orderStatus";
import TablePagination from "@/components/Tables/Pagination";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OrderListItem, TimelineActor, StatusCheck } from "@/components/_atoms/OrderAtoms";

// Shadcn UI components (Assuming standard installation paths)
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RefundPanel from "./RefundPanel";

const PAGE_SIZE = 50;
const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

const OrderManagement = () => {
	// Filters live in the URL, so links (e.g. ?search=<code> from the detail
	// panel), refresh and back all keep them.
	const router = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();
	const initialDate = params.get("date") ?? "";

	const [searchQuery, setSearchQuery] = useState(params.get("search") ?? "");
	const [statusFilter, setStatusFilterState] = useState(params.get("status") ?? "All");
	const [date, setDateState] = useState<Date | undefined>(
		DAY_KEY.test(initialDate) ? parseISO(initialDate) : undefined,
	);
	const [page, setPage] = useState(1);
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

	const debouncedSearch = useDebounce(searchQuery.trim(), 400);
	const dayKey = date ? format(date, "yyyy-MM-dd") : "";
	const status = statusFilter === "All" ? undefined : statusFilter;

	useEffect(() => {
		const next = new URLSearchParams();
		if (debouncedSearch) next.set("search", debouncedSearch);
		if (status) next.set("status", status);
		if (dayKey) next.set("date", dayKey);
		const query = next.toString();
		router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
	}, [debouncedSearch, status, dayKey, pathname, router]);

	// Search, status and day filter on the server, one page at a time.
	useEffect(() => setPage(1), [debouncedSearch, status, dayKey]);
	const {
		data: orderResponse,
		isLoading,
		isFetching,
	} = usePaginatedOrders({
		search: debouncedSearch,
		status,
		date: dayKey || undefined,
		page,
		limit: PAGE_SIZE,
	});
	const filteredOrders = useMemo(() => orderResponse?.data ?? [], [orderResponse]);

	const setStatusFilter = (value: string) => setStatusFilterState(value);
	const setDate = (value: Date | undefined) => setDateState(value);

	// Only an order that is in the list can be open: filtering it out closes it.
	const activeOrder = useMemo(
		() => filteredOrders.find((o) => o._id === selectedOrderId) ?? null,
		[selectedOrderId, filteredOrders],
	);

	// Utility to conditionally define visual color codes
	const getStatusColor = (orderStatus: string) => {
		if (
			["pending", "placed", "accepted", "preparing", "ready", "picked_up"].includes(
				orderStatus,
			)
		)
			return "yellow";
		if (["delivered"].includes(orderStatus)) return "green";
		return "red";
	};

	const dotClass = {
		green: "bg-[#22C55E]",
		red: "bg-[#EF4444]",
		yellow: "bg-[#EAB308]",
	};

	let listBody: React.ReactNode;
	if (isLoading) {
		listBody = (
			<div className="flex justify-center p-6">
				<Loader2 className="text-secondary animate-spin" />
			</div>
		);
	} else if (filteredOrders.length === 0) {
		listBody = (
			<div className="text-muted-foreground mt-4 text-center text-sm">No matching orders</div>
		);
	} else {
		listBody = (
			<div className="custom-scrollbar flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1">
				{filteredOrders.map((o) => (
					<button
						type="button"
						key={o._id}
						className="text-left"
						onClick={() => setSelectedOrderId(o._id)}
					>
						<OrderListItem
							orderId={(o.orderId || o._id).slice(-6)}
							statusColor={getStatusColor(o.status)}
							isActive={activeOrder?._id === o._id}
						/>
					</button>
				))}
			</div>
		);
	}

	return (
		<div className="bg-background size-full space-y-6 p-6">
			{/* --- Top Header with Icon --- */}
			<div className="mb-6 flex items-center gap-3">
				<Icon icon="heroicons:clipboard-document-list" className="text-secondary size-8" />
				<h1 className="text-foreground text-2xl font-bold">Order Lifecycle Management</h1>
			</div>

			{/* --- Filter Bar --- */}
			<div className="flex flex-wrap items-center gap-4">
				{/* Search */}
				<div className="relative w-64">
					<Icon
						icon="lucide:search"
						className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
					/>
					<Input
						placeholder="Order code, customer or vendor"
						className="bg-card border-border h-10 pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				{/* Date Filter Button */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className={cn(
								"border-border bg-card text-foreground size-10 flex-shrink-0 transition-all",
								date && "border-primary bg-primary/5 text-primary shadow-sm",
							)}
						>
							<CalendarIcon className="size-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							initialFocus
							className="rounded-md border-none"
						/>
						{date && (
							<div className="border-t p-2">
								<Button
									variant="ghost"
									className="hover:text-destructive h-8 w-full text-xs font-medium transition-colors"
									onClick={() => setDate(undefined)}
								>
									Clear Date Filter
								</Button>
							</div>
						)}
					</PopoverContent>
				</Popover>

				{/* Status Pills */}
				<Button
					className={`h-10 px-6 ${statusFilter === "All" ? "bg-accent hover:bg-accent/90 text-white" : "border-border text-foreground hover:bg-accent/20 border bg-transparent"}`}
					onClick={() => setStatusFilter("All")}
				>
					All
				</Button>

				{/* Dropdowns / Buttons */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="border-border bg-card text-foreground flex h-10 gap-2 px-4 capitalize"
						>
							{statusFilter !== "All" ? orderStatusLabel(statusFilter) : "Status"}
							<Icon icon="lucide:chevron-down" className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[180px]">
						<DropdownMenuItem onClick={() => setStatusFilter("All")}>
							All
						</DropdownMenuItem>
						{ORDER_STATUS_OPTIONS.map((option) => (
							<DropdownMenuItem
								key={option.value}
								onClick={() => setStatusFilter(option.value)}
							>
								{option.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* --- Main Content Grid --- */}
			<div className="mt-8">
				<h2 className="text-foreground mb-4 text-xl font-medium">Order Timeline View</h2>

				<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
					{/* === COLUMN 1: ORDER LIST (Left Sidebar) === */}
					<div className="flex flex-col gap-3 lg:col-span-3">
						{/* Header */}
						<div className="bg-secondary text-secondary-foreground mb-1 flex items-center gap-2 rounded-lg p-3">
							<Icon icon="heroicons:document-text" className="size-5" />
							<span className="font-semibold">
								Orders ({orderResponse?.pagination?.total ?? filteredOrders.length})
							</span>
						</div>

						{/* List */}
						{listBody}
						<TablePagination
							pagination={orderResponse?.pagination}
							onPageChange={setPage}
							isFetching={isFetching}
							itemLabel="orders"
						/>
					</div>

					{/* === COLUMN 2: TIMELINE DETAILS (Middle) === */}
					<div className="bg-card border-border rounded-xl border p-6 shadow-sm lg:col-span-5">
						{!activeOrder ? (
							<div className="text-muted-foreground flex h-[300px] items-center justify-center text-center">
								Select an order to view Timeline
							</div>
						) : (
							<>
								{/* Order Header */}
								<div className="dark:bg-accent/10 border-accent/20 mb-8 flex items-center justify-between rounded-lg border bg-orange-50 p-3">
									<div className="flex items-center gap-2">
										<div
											className={`size-2.5 rounded-full ${dotClass[getStatusColor(activeOrder.status)]}`}
										/>
										<span className="text-foreground flex items-center gap-2 font-semibold">
											Order ID: #
											{activeOrder.orderId?.slice(-6) ||
												activeOrder._id.slice(-6)}
											<span className="text-muted-foreground ml-2 rounded-sm border px-2 py-0.5 text-[10px] font-normal uppercase">
												{activeOrder.status}
											</span>
										</span>
									</div>
									<Icon
										icon="lucide:copy"
										className="text-muted-foreground hover:text-foreground size-4 cursor-pointer"
										onClick={() =>
											navigator.clipboard.writeText(
												activeOrder.orderId || activeOrder._id,
											)
										}
									/>
								</div>

								{/* Actors Timeline */}
								<div className="mb-8 pl-2">
									<TimelineActor
										name={activeOrder.customer?.name || "Unknown Customer"}
										role="Customer"
										idLabel="Customer ID Number"
										idValue={
											activeOrder.customer?._id?.slice(-6).toUpperCase() ||
											"N/A"
										}
										time={
											activeOrder.createdAt
												? new Date(
														activeOrder.createdAt,
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: true,
													})
												: "N/A"
										}
									/>
									<TimelineActor
										name={
											activeOrder.vendor?.vendorProfile?.businessName ??
											activeOrder.vendor?.name ??
											"Unknown Vendor"
										}
										role="Vendor"
										idLabel="Vendor ID Number"
										idValue={
											activeOrder.vendor?._id?.slice(-6).toUpperCase() ??
											"N/A"
										}
										time={
											activeOrder.createdAt
												? new Date(
														new Date(activeOrder.createdAt).getTime() +
															2 * 60000,
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: true,
													})
												: "N/A"
										}
									/>
									<TimelineActor
										name={activeOrder.rider?.name ?? "Unassigned"}
										role="Rider"
										idLabel="Rider's ID Number"
										idValue={
											activeOrder.rider?._id?.slice(-6).toUpperCase() ?? "N/A"
										}
										time={
											activeOrder.status === "pending" || !activeOrder.rider
												? "Pending"
												: new Date().toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: true,
													})
										}
										isLast
									/>
								</div>

								{/* Status Steps */}
								<div className="space-y-3">
									<StatusCheck label="Order Placed" isChecked />
									<StatusCheck
										label="Order Accepted"
										isChecked={[
											"accepted",
											"preparing",
											"ready",
											"picked_up",
											"delivered",
										].includes(activeOrder.status)}
									/>
									<StatusCheck
										label="Picked Up"
										isChecked={["picked_up", "delivered"].includes(
											activeOrder.status,
										)}
									/>
									<StatusCheck
										label="Delivered"
										isChecked={["delivered"].includes(activeOrder.status)}
									/>
								</div>
							</>
						)}
					</div>

					{/* === COLUMN 3: ACTION PANELS (Right) === */}
					<div className="space-y-6 lg:col-span-4">
						{/* Panel 1: Dispute Resolution - HIDDEN/COMMENTED OUT BY REQUEST */}
						{/*
						<div className="bg-card border-border rounded-xl border p-6 shadow-sm">
							<PanelHeader title="Dispute Resolution Panel" />

							<div className="space-y-4">
								<div className="space-y-1.5">
									<label className="text-foreground text-sm font-medium">
										Reason
									</label>
									<div className="relative">
										<div className="border-input ring-offset-background text-muted-foreground flex w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm">
											Incorrect item received
										</div>
									</div>
								</div>

								<div className="space-y-1.5">
									<label className="text-foreground text-sm font-medium">
										Notes
									</label>
									<Textarea
										placeholder="Add notes"
										className="min-h-[100px] resize-none bg-transparent"
									/>
								</div>

								<Button className="bg-secondary hover:bg-secondary/90 h-11 w-full text-base font-medium text-white">
									Resolve
								</Button>
							</div>
						</div>
						*/}

						<RefundPanel order={activeOrder ?? undefined} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderManagement;

/* eslint-enable */
