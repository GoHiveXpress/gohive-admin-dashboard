"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, no-nested-ternary */

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrderManagementTabList() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Record<string, unknown> | null>(null);
	const [status, setStatus] = useState("all");
	const [search, setSearch] = useState("");

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
				<Button variant="outline" className="border-border size-10 rounded-lg bg-white p-0">
					<Icon icon="ph:sliders-horizontal" width="20" />
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="border-border h-10 min-w-[120px] justify-between rounded-lg bg-white px-4 font-medium"
						>
							{status === "all" ? "Status" : status}{" "}
							<Icon icon="ph:caret-down" className="ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[180px]">
						<DropdownMenuItem onClick={() => setStatus("all")}>
							All Status
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("placed")}>
							Placed
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("preparing")}>
							Preparing
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("ready")}>
							Ready
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("picked_up")}>
							Picked up
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("delivered")}>
							Delivered
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("cancelled")}>
							Cancelled
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button
					variant="outline"
					className="border-border h-10 rounded-lg bg-white px-4 font-medium"
				>
					Vendor
				</Button>
				<Button
					variant="outline"
					className="border-border h-10 rounded-lg bg-white px-4 font-medium"
				>
					Location
				</Button>
			</div>

			{/* Map Placeholder */}
			<div className="border-border/20 text-muted-foreground/30 flex h-64 w-full items-center justify-center rounded-[20px] border bg-[#F5F5F0]">
				<Icon icon="ph:map-trifold" className="size-12 opacity-20" />
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
					data={orders}
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
