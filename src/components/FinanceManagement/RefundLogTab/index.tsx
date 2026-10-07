"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRefundLogs } from "@/hooks/financeManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { type RefundLog } from "@/types/financeManagement";
import TableExport from "@/components/_atoms/TableExport";

export default function RefundLogTab() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [date, setDate] = useState<Date | undefined>(undefined);

	const debouncedSearch = useDebounce(searchQuery, 500);

	const [selectedLog, setSelectedLog] = useState<RefundLog | null>(null);

	const { data: logsResponse, isLoading } = useRefundLogs({
		search: debouncedSearch,
		status: statusFilter,
		date: date ? format(date, "yyyy-MM-dd") : undefined,
	});

	const logs = logsResponse?.data || [];

	const handleRowClick = (log: RefundLog) => {
		setSelectedLog(log);
	};

	const exportColumns = [
		{ header: "Order ID", key: "orderId" },
		{ header: "Status", key: "status" },
		{ header: "Reason", key: "reason" },
		{ header: "Amount", key: "refundAmount" },
		{ header: "Date", key: "createdAt" },
	];

	return (
		<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
			{/* === LEFT COLUMN: Refund Logs List === */}
			<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm lg:col-span-7">
				<h2 className="mb-6 text-xl font-medium">Refund Logs</h2>

				{/* Filters */}
				<div className="mb-6 flex flex-wrap items-center gap-3">
					<div className="relative w-full sm:w-[200px]">
						<Icon
							icon="lucide:search"
							className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
						/>
						<Input
							placeholder="Search Order ID"
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
									date && "border-primary bg-primary/5 text-primary",
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
						onClick={() => setStatusFilter("all")}
						className={cn(
							"h-10 rounded-lg px-6 transition-colors",
							statusFilter === "all"
								? "bg-accent text-white"
								: "bg-transparent border border-border text-foreground",
						)}
					>
						All
					</Button>

					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="border-border h-10 w-[140px] rounded-lg bg-transparent">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="cancelled">Cancelled</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
							<SelectItem value="expired">Expired</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Table */}
				<div className="border-border overflow-hidden border-t">
					<Table>
						<TableHeader>
							<TableRow className="border-border border-b hover:bg-transparent">
								<TableHead className="text-foreground w-[180px] px-4 text-xs font-medium uppercase">
									Order ID
								</TableHead>
								<TableHead className="text-foreground px-4 text-xs font-medium uppercase">
									Status
								</TableHead>
								<TableHead className="text-foreground px-4 text-xs font-medium uppercase">
									Reason
								</TableHead>
								<TableHead className="text-foreground px-4 text-right text-xs font-medium uppercase">
									Refund
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={4} className="h-24 text-center">
										Loading logs...
									</TableCell>
								</TableRow>
							) : logs.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="h-24 text-center">
										No refund logs found
									</TableCell>
								</TableRow>
							) : (
								logs.map((log) => (
									<TableRow
										key={log.id}
										className={cn(
											"border-border/50 h-16 border-b cursor-pointer transition-colors",
											selectedLog?.id === log.id
												? "bg-muted/50"
												: "hover:bg-muted/30",
										)}
										onClick={() => handleRowClick(log)}
									>
										<TableCell className="px-4 font-medium">
											<div className="flex items-center gap-2">
												<div className="border-primary size-2.5 shrink-0 rounded-full border-2" />
												<div className="flex flex-col">
													<span className="text-muted-foreground mb-1 text-[10px] leading-none">
														Order ID
													</span>
													<span className="border-border bg-muted/20 rounded border px-1.5 py-0.5 text-xs font-semibold">
														#{log.orderId}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4">
											<span
												className={cn(
													"text-[11px] font-bold uppercase",
													log.status === "cancelled"
														? "text-accent"
														: log.status === "rejected"
															? "text-destructive"
															: "text-primary",
												)}
											>
												{log.status}
											</span>
										</TableCell>
										<TableCell className="text-muted-foreground max-w-[200px] truncate px-4 text-sm font-medium">
											{log.reason}
										</TableCell>
										<TableCell className="text-accent px-4 text-right font-bold">
											{log.refundAmount}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Footer / Export */}
				<div className="border-border mt-8 border-t pt-6">
					<div className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
						<Icon icon="lucide:download" className="text-secondary size-4" />
						Download Refund Logs
					</div>
					<TableExport
						data={logs}
						columns={exportColumns}
						filename={`Refund_Logs_${date ? format(date, "yyyy-MM-dd") : "Latest"}`}
						title="Finance Management - Refund Logs"
					/>
				</div>
			</div>

			{/* === RIGHT COLUMN: Details === */}
			<div className="space-y-6 lg:col-span-5">
				{/* Order Summary Card */}
				<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
					<div className="mb-6 flex items-center gap-2">
						<div className="border-primary size-4 rounded-full border-[3px]" />
						<h3 className="text-lg font-semibold">Order Summary</h3>
					</div>

					{selectedLog ? (
						<>
							<div className="mb-4 flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground">Order ID</span>
									<span className="border-border bg-muted/20 rounded border px-2 py-0.5 text-xs font-bold">
										#{selectedLog.orderId}
									</span>
								</div>
								<span className="text-muted-foreground text-[10px] font-medium uppercase tracking-tight">
									{new Date(selectedLog.createdAt).toLocaleDateString("en-GB", {
										day: "2-digit",
										month: "short",
										year: "numeric",
									})}{" "}
									|{" "}
									{new Date(selectedLog.createdAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})}
								</span>
							</div>

							<div className="mb-6 space-y-3">
								<div className="flex items-center gap-3 text-sm">
									<Icon icon="lucide:user" className="text-secondary size-4" />
									<span className="text-muted-foreground w-20 text-[11px] font-medium uppercase">
										Customer ID
									</span>
									<span className="border-border bg-muted/10 rounded border px-2 py-0.5 font-mono text-[10px]">
										{selectedLog.orderDetails?.customer?._id
											?.slice(-8)
											.toUpperCase() || "N/A"}
									</span>
								</div>
								<div className="flex items-center gap-3 text-sm">
									<Icon icon="lucide:store" className="text-secondary size-4" />
									<span className="text-muted-foreground w-20 text-[11px] font-medium uppercase">
										Vendor ID
									</span>
									<span className="border-border bg-muted/10 rounded border px-2 py-0.5 font-mono text-[10px]">
										{selectedLog.orderDetails?.vendor?._id
											?.slice(-8)
											.toUpperCase() || "N/A"}
									</span>
								</div>
								<div className="flex items-center gap-3 text-sm">
									<Icon icon="lucide:bike" className="text-secondary size-4" />
									<span className="text-muted-foreground w-20 text-[11px] font-medium uppercase">
										Rider ID
									</span>
									<span className="border-border bg-muted/10 rounded border px-2 py-0.5 font-mono text-[10px]">
										{selectedLog.orderDetails?.rider?._id
											?.slice(-8)
											.toUpperCase() || "N/A"}
									</span>
								</div>
							</div>

							<div className="border-border space-y-3 border-t pt-5">
								{selectedLog.orderDetails?.items?.map((item: any, idx: number) => (
									<div
										key={idx}
										className="flex items-center justify-between text-sm"
									>
										<span className="text-foreground font-medium">
											{item.quantity} X {item.name}
										</span>
										<span className="font-bold">
											₦{item.price.toLocaleString()}
										</span>
									</div>
								))}
							</div>

							<div className="border-border mt-5 space-y-2 border-t pt-5">
								<div className="text-muted-foreground flex justify-between text-[11px] font-medium uppercase">
									<span>Service charge</span>
									<span>
										₦
										{selectedLog.orderDetails?.serviceFee?.toLocaleString() ||
											0}
									</span>
								</div>
								<div className="text-muted-foreground flex justify-between text-[11px] font-medium uppercase">
									<span>Delivery fee</span>
									<span>
										₦
										{selectedLog.orderDetails?.deliveryFee?.toLocaleString() ||
											0}
									</span>
								</div>
							</div>

							<div className="border-border mt-4 flex items-center justify-between border-t pt-4">
								<div className="text-muted-foreground flex items-center gap-1 text-[11px] font-bold uppercase">
									Total amount:{" "}
									<Icon icon="lucide:chevron-up" className="text-accent size-3" />
								</div>
								<span className="text-foreground text-xl font-black">
									₦
									{selectedLog.orderDetails?.totalAmount?.toLocaleString() ||
										selectedLog.refundAmount}
								</span>
							</div>
						</>
					) : (
						<div className="border-border text-muted-foreground flex h-48 flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed text-sm">
							<Icon icon="lucide:mouse-pointer-click" className="size-6 opacity-20" />
							<span className="font-medium italic">
								Select a log to view order details
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
