"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
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
import { cn } from "@/lib/utils";

export default function RefundLogTab() {
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
							placeholder="Search"
							className="border-border h-10 rounded-lg bg-transparent pl-9"
						/>
					</div>

					<Button
						variant="outline"
						size="icon"
						className="border-border size-10 bg-transparent"
					>
						<Icon icon="lucide:sliders-horizontal" className="size-4" />
					</Button>

					<Button className="bg-accent hover:bg-accent/90 h-10 rounded-lg px-6 text-white">
						All
					</Button>

					<Button
						variant="outline"
						className="border-border flex h-10 items-center gap-2 rounded-lg bg-transparent px-4 text-sm font-medium"
					>
						status <Icon icon="lucide:chevron-down" className="size-4" />
					</Button>
				</div>

				{/* Simple Custom Table for Refund Log */}
				<div className="border-border border-t">
					<Table>
						<TableHeader>
							<TableRow className="border-border border-b hover:bg-transparent">
								<TableHead className="text-foreground w-[140px] text-xs font-medium uppercase">
									Order ID
								</TableHead>
								<TableHead className="text-foreground text-xs font-medium uppercase">
									Status
								</TableHead>
								<TableHead className="text-foreground text-xs font-medium uppercase">
									Reason
								</TableHead>
								<TableHead className="text-foreground text-right text-xs font-medium uppercase">
									Refund
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{/* Row 1 */}
							<TableRow className="border-border/50 h-14 border-b">
								<TableCell className="font-medium">
									<div className="flex items-center gap-2">
										<div className="border-primary size-2.5 rounded-full border-2" />
										<span className="text-muted-foreground text-xs">
											Order ID
										</span>
										<span className="border-border rounded border px-1 text-xs">
											#12345
										</span>
									</div>
								</TableCell>
								<TableCell className="text-accent text-xs font-medium">
									Processing
								</TableCell>
								<TableCell className="text-sm">Wrong item received</TableCell>
								<TableCell className="text-accent text-right font-medium">
									₦3000
								</TableCell>
							</TableRow>
							{/* Row 2 */}
							<TableRow className="border-border/50 h-14 border-b">
								<TableCell className="font-medium">
									<div className="flex items-center gap-2">
										<div className="border-primary size-2.5 rounded-full border-2" />
										<span className="text-muted-foreground text-xs">
											Order ID
										</span>
										<span className="border-border rounded border px-1 text-xs">
											#12345
										</span>
									</div>
								</TableCell>
								<TableCell className="text-secondary text-xs font-medium">
									Approved
								</TableCell>
								<TableCell className="text-sm">Delivery delay</TableCell>
								<TableCell className="text-secondary text-right font-medium">
									₦3000
								</TableCell>
							</TableRow>
							{/* Row 3 */}
							<TableRow className="border-border/50 h-14 border-b">
								<TableCell className="font-medium">
									<div className="flex items-center gap-2">
										<div className="border-primary size-2.5 rounded-full border-2" />
										<span className="text-muted-foreground text-xs">
											Order ID
										</span>
										<span className="border-border rounded border px-1 text-xs">
											#12345
										</span>
									</div>
								</TableCell>
								<TableCell className="text-primary text-xs font-medium">
									Pending
								</TableCell>
								<TableCell className="text-sm">Incorrect charge</TableCell>
								<TableCell className="text-primary text-right font-medium">
									₦3000
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>

				{/* Footer */}
				<div className="mt-8 pt-4">
					<div className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
						<Icon icon="lucide:download" className="size-4" />
						Download Refund Logs
					</div>
					<div className="flex gap-3">
						<Button className="bg-secondary hover:bg-secondary/90 w-20 text-white">
							PDF
						</Button>
						<Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-20">
							CVS
						</Button>
					</div>
				</div>
			</div>

			{/* === RIGHT COLUMN: Details & Action === */}
			<div className="space-y-6 lg:col-span-5">
				{/* Order Summary Card */}
				<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
					<div className="mb-6 flex items-center gap-2">
						<div className="border-primary size-4 rounded-full border-[3px]" />
						<h3 className="text-lg font-semibold">Order Summary</h3>
					</div>

					{/* Header info */}
					<div className="mb-4 flex items-center justify-between text-sm">
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Order ID</span>
							<span className="border-border bg-muted/20 rounded border px-2 py-0.5 text-xs">
								#12345
							</span>
						</div>
						<span className="text-muted-foreground text-xs font-medium">
							02 Nov 2025 | 7:45 PM
						</span>
					</div>

					{/* IDs */}
					<div className="mb-6 space-y-2">
						<div className="flex items-center gap-2 text-sm">
							<Icon icon="lucide:smile" className="text-secondary size-4" />
							<span className="text-muted-foreground w-16 text-xs">Customer ID</span>
							<span className="border-border rounded border px-2 py-0.5 text-[10px]">
								CHV12345
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<Icon icon="lucide:store" className="text-secondary size-4" />
							<span className="text-muted-foreground w-16 text-xs">Vendor ID</span>
							<span className="border-border rounded border px-2 py-0.5 text-[10px]">
								VHV12345
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<Icon icon="lucide:bike" className="text-secondary size-4" />
							<span className="text-muted-foreground w-16 text-xs">Rider ID</span>
							<span className="border-border rounded border px-2 py-0.5 text-[10px]">
								RHV12345
							</span>
						</div>
					</div>

					{/* Items */}
					<div className="border-border space-y-3 border-t pt-4">
						<div className="flex justify-between text-sm font-semibold">
							<span>1 X Mixed Rice with Chicken</span>
							<span>₦3,000</span>
						</div>
						<div className="flex justify-between text-sm font-semibold">
							<span>1 X Fanta 50cl</span>
							<span>₦500</span>
						</div>
					</div>

					{/* Calculations */}
					<div className="border-border mt-4 space-y-2 border-t pt-4">
						<div className="text-muted-foreground flex justify-between text-xs">
							<span>Restaurant packaging</span>
							<span>#100</span>
						</div>
						<div className="text-muted-foreground flex justify-between text-xs">
							<span>Service charge</span>
							<span>#500</span>
						</div>
					</div>

					{/* Total */}
					<div className="mt-2 flex items-center justify-between pt-4">
						<div className="text-muted-foreground flex items-center gap-1 text-sm">
							Total bill: <Icon icon="lucide:chevron-up" className="size-3" />
						</div>
						<span className="text-lg font-bold">₦4,100</span>
					</div>
				</div>

				{/* Process Refund Form Card */}
				<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
					<div className="mb-6 flex items-center gap-2">
						<div className="border-primary size-4 rounded-full border-[3px]" />
						<h3 className="text-lg font-semibold">Process Refund</h3>
					</div>

					<div className="space-y-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium">Order ID</label>
							<Input defaultValue="#12345" className="border-border h-11 bg-white" />
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-medium">Reason</label>
							<Select>
								<SelectTrigger className="border-border h-11 bg-white">
									<SelectValue placeholder="Select reason" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="wrong_item">Wrong item received</SelectItem>
									<SelectItem value="delayed">Delivery delay</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-medium">Amount</label>
							<Input defaultValue="₦4,100" className="border-border h-11 bg-white" />
						</div>

						<Button className="bg-secondary hover:bg-secondary/90 mt-2 h-11 w-full text-base font-medium text-white">
							Process
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
