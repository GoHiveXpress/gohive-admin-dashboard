"use client";

/* eslint-disable jsx-a11y/aria-role */

import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useOrders } from "@/hooks/customerManagement";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OrderListItem, TimelineActor, StatusCheck } from "@/components/_atoms/OrderAtoms";
import RefundPanel from "./RefundPanel";

// Shadcn UI components (Assuming standard installation paths)
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OrderManagement = () => {
	const { data: orderResponse, isLoading } = useOrders({});
	const orders = orderResponse?.data || [];

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

	// Dynamically filter orders
	const filteredOrders = useMemo(() => {
		return orders.filter((o: any) => {
			const matchesSearch =
				searchQuery === "" ||
				o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				o._id?.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus =
				statusFilter === "All" || o.status?.toLowerCase() === statusFilter.toLowerCase();

			const matchesDate = !date || (o.createdAt && isSameDay(new Date(o.createdAt), date));

			return matchesSearch && matchesStatus && matchesDate;
		});
	}, [orders, searchQuery, statusFilter, date]);

	// Extract the actual selected order object
	const activeOrder = useMemo(() => {
		if (selectedOrderId) {
			return orders.find((o: any) => o._id === selectedOrderId) || filteredOrders[0];
		}
		return filteredOrders[0];
	}, [selectedOrderId, filteredOrders, orders]) as any;

	// Utility to conditionally define visual color codes
	const getStatusColor = (status: string) => {
		if (["pending", "placed", "accepted", "preparing", "ready", "picked_up"].includes(status))
			return "yellow";
		if (["delivered"].includes(status)) return "green";
		return "red";
	};

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
						placeholder="Search by Order ID"
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
									className="w-full h-8 text-xs font-medium hover:text-destructive transition-colors"
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
					className={`h-10 px-6 ${statusFilter === "All" ? "bg-accent text-white hover:bg-accent/90" : "bg-transparent border border-border text-foreground hover:bg-accent/20"}`}
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
							{statusFilter !== "All" ? statusFilter.replace("_", " ") : "Status"}
							<Icon icon="lucide:chevron-down" className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[180px]">
						<DropdownMenuItem onClick={() => setStatusFilter("All")}>
							All
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("pending")}>
							Pending
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("preparing")}>
							Preparing
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("ready")}>
							Ready
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("picked_up")}>
							Picked Up
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("delivered")}>
							Delivered
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
							Rejected
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
							Cancelled
						</DropdownMenuItem>
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
							<span className="font-semibold">Orders ({filteredOrders.length})</span>
						</div>

						{/* List */}
						{isLoading ? (
							<div className="flex justify-center p-6">
								<Loader2 className="animate-spin text-secondary" />
							</div>
						) : filteredOrders.length === 0 ? (
							<div className="text-sm text-center text-muted-foreground mt-4">
								No matching orders
							</div>
						) : (
							<div className="overflow-y-auto max-h-[600px] flex flex-col gap-3 pr-1 custom-scrollbar">
								{filteredOrders.map((o: any) => (
									<div key={o._id} onClick={() => setSelectedOrderId(o._id)}>
										<OrderListItem
											orderId={o.orderId?.slice(-6) || o._id.slice(-6)}
											statusColor={getStatusColor(o.status)}
											isActive={activeOrder?._id === o._id}
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* === COLUMN 2: TIMELINE DETAILS (Middle) === */}
					<div className="bg-card border-border rounded-xl border p-6 shadow-sm lg:col-span-5">
						{!activeOrder ? (
							<div className="text-center text-muted-foreground flex items-center justify-center h-[300px]">
								Select an order to view Timeline
							</div>
						) : (
							<>
								{/* Order Header */}
								<div className="dark:bg-accent/10 border-accent/20 mb-8 flex items-center justify-between rounded-lg border bg-orange-50 p-3">
									<div className="flex items-center gap-2">
										<div
											className={`size-2.5 rounded-full ${getStatusColor(activeOrder.status) === "green" ? "bg-[#22C55E]" : getStatusColor(activeOrder.status) === "red" ? "bg-[#EF4444]" : "bg-[#EAB308]"}`}
										/>
										<span className="text-foreground font-semibold flex items-center gap-2">
											Order ID: #
											{activeOrder.orderId?.slice(-6) ||
												activeOrder._id.slice(-6)}
											<span className="text-[10px] font-normal uppercase text-muted-foreground ml-2 px-2 py-0.5 border rounded-sm">
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
											activeOrder.vendor?.vendorProfile?.businessName ||
											activeOrder.vendor?.name ||
											"Unknown Vendor"
										}
										role="Vendor"
										idLabel="Vendor ID Number"
										idValue={
											activeOrder.vendor?._id?.slice(-6).toUpperCase() ||
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
										name={activeOrder.rider?.name || "Unassigned"}
										role="Rider"
										idLabel="Rider's ID Number"
										idValue={
											activeOrder.rider?._id?.slice(-6).toUpperCase() || "N/A"
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
									<StatusCheck label="Order Placed" isChecked={true} />
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

						<RefundPanel order={activeOrder} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderManagement;

/* eslint-enable */
