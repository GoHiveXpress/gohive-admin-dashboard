"use client";

/* eslint-disable jsx-a11y/aria-role */

import React from "react";
import { Icon } from "@iconify/react";
import {
	OrderListItem,
	TimelineActor,
	StatusCheck,
	PanelHeader,
} from "@/components/_atoms/OrderAtoms";

// Shadcn UI components (Assuming standard installation paths)
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const OrderManagement = () => {
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
					<Input placeholder="Search" className="bg-card border-border h-10 pl-9" />
				</div>

				{/* Filter Button */}
				<Button
					variant="outline"
					size="icon"
					className="border-border bg-card text-foreground size-10"
				>
					<Icon icon="lucide:sliders-horizontal" className="size-4" />
				</Button>

				{/* Status Pills */}
				<Button className="bg-accent hover:bg-accent/90 h-10 px-6 text-white">All</Button>

				{/* Dropdowns / Buttons */}
				{["Status", "Customer", "Vendor", "Rider"].map((item) => (
					<Button
						key={item}
						variant="outline"
						className="border-border bg-card text-foreground flex h-10 gap-2 px-4"
					>
						{item}
						{item === "Status" && (
							<Icon icon="lucide:chevron-down" className="size-4" />
						)}
					</Button>
				))}
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
							<span className="font-semibold">Orders (7)</span>
						</div>

						{/* List */}
						<OrderListItem orderId="95345" statusColor="yellow" />
						<OrderListItem orderId="28345" statusColor="yellow" />
						<OrderListItem orderId="12346" statusColor="red" />
						<OrderListItem orderId="12379" statusColor="red" />
						<OrderListItem orderId="12379" statusColor="red" />
						<OrderListItem orderId="12379" statusColor="red" />
						<OrderListItem orderId="12379" statusColor="red" />
					</div>

					{/* === COLUMN 2: TIMELINE DETAILS (Middle) === */}
					<div className="bg-card border-border rounded-xl border p-6 shadow-sm lg:col-span-5">
						{/* Order Header */}
						<div className="dark:bg-accent/10 border-accent/20 mb-8 flex items-center justify-between rounded-lg border bg-orange-50 p-3">
							<div className="flex items-center gap-2">
								<div className="bg-primary size-2.5 rounded-full" />
								<span className="text-foreground font-semibold">
									Order ID: #12345
								</span>
							</div>
							<Icon
								icon="lucide:copy"
								className="text-muted-foreground hover:text-foreground size-4 cursor-pointer"
							/>
						</div>

						{/* Actors Timeline */}
						<div className="mb-8 pl-2">
							<TimelineActor
								name="Paul Paul"
								role="Customer"
								idLabel="Customer ID Number"
								idValue="RGHV0923"
								time="11:30 PM"
							/>
							<TimelineActor
								name="Item7 Go"
								role="Vendor"
								idLabel="Vendor ID Number"
								idValue="RGHV0923"
								time="11:32 PM"
							/>
							<TimelineActor
								name="James James"
								role="Rider"
								idLabel="Rider's ID Number"
								idValue="RGHV0923"
								time="11:50 PM"
								isLast
							/>
						</div>

						{/* Status Steps */}
						<div className="space-y-3">
							<StatusCheck label="Order Placed" isChecked />
							<StatusCheck label="Order Accepted" isChecked />
							<StatusCheck label="Picked Up" isChecked />
							<StatusCheck label="Delivered" isChecked />
						</div>
					</div>

					{/* === COLUMN 3: ACTION PANELS (Right) === */}
					<div className="space-y-6 lg:col-span-4">
						{/* Panel 1: Dispute Resolution */}
						<div className="bg-card border-border rounded-xl border p-6 shadow-sm">
							<PanelHeader title="Dispute Resolution Panel" />

							<div className="space-y-4">
								<div className="space-y-1.5">
									<label className="text-foreground text-sm font-medium">
										Reason
									</label>
									<div className="relative">
										{/* Simulating a Select Box to match design */}
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

						{/* Panel 2: Refund & Adjustment */}
						<div className="bg-card border-border rounded-xl border p-6 shadow-sm">
							<PanelHeader title="Refund & Adjustment panel" />

							<div className="space-y-4">
								<div className="space-y-1.5">
									<label className="text-foreground text-sm font-medium">
										Refund Amount
									</label>
									<Input defaultValue="#3500" className="h-11 bg-transparent" />
								</div>

								<Button className="bg-secondary hover:bg-secondary/90 h-11 w-full text-base font-medium text-white">
									Process Refund
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderManagement;

/* eslint-enable */
