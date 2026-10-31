"use client";

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type OrderHistory } from "@/components/Tables/columns/orderHistoryColumns";
import { useOrder } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { buildOrderTimeline, formatStepTime, isEndedStatus } from "@/lib/orderTimeline";
import { orderStatusLabel } from "@/lib/orderStatus";

interface OrderProcessModalProps {
	isOpen: boolean;
	onClose: () => void;
	data: OrderHistory | null;
}

const ENDED_DETAILS: Record<string, string> = {
	expired: "The vendor did not accept the order in time, so the customer was refunded in full.",
	cancelled: "The order was cancelled before it was delivered.",
	rejected: "The vendor turned the order down.",
	payment_failed: "The customer's payment did not go through, so the order was never placed.",
};

export default function OrderProcessModal({ isOpen, onClose, data }: OrderProcessModalProps) {
	// Poll for the latest order data in real time
	const { data: orderResponse, isLoading } = useOrder(data?._id || "");
	const currentOrder = orderResponse?.data || data;

	const [showDetails, setShowDetails] = useState(false);
	useEffect(() => {
		if (!isOpen) setShowDetails(false);
	}, [isOpen]);

	if (!currentOrder) return null;

	const orderStatus = currentOrder.status;
	const isErrorState = isEndedStatus(orderStatus);
	const steps = buildOrderTimeline(currentOrder);

	// The line runs up to the last step the order reached
	const lastReached = steps.reduce(
		(last, step, idx) => (step.state === "pending" ? last : idx),
		0,
	);
	const progressWidth = steps.length > 1 ? `${(lastReached / (steps.length - 1)) * 100}%` : "0%";

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-full max-w-[700px] overflow-hidden rounded-[20px] border-none bg-white p-0 shadow-xl">
				{/* Header */}
				<div className="flex items-center justify-between p-6 pb-2">
					<DialogTitle className="text-foreground text-xl font-bold">
						Order Summary
					</DialogTitle>
				</div>

				{/* Content */}
				<div className="space-y-8 p-6 pt-2">
					{/* Data Grid */}
					{isLoading ? (
						<div className="space-y-2">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					) : (
						<div className="grid grid-cols-2 gap-4 rounded-lg bg-[#F9FAFB] p-4 text-center text-sm sm:grid-cols-4">
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground font-semibold">
									Order ID
								</span>
								<span className="text-foreground font-bold">
									{currentOrder.orderId}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground font-semibold">Vendor</span>
								<span className="text-foreground font-medium">
									{typeof currentOrder.vendor === "object"
										? currentOrder.vendor?.vendorProfile?.businessName
										: currentOrder.vendor}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground font-semibold">
									Customer
								</span>
								<span className="text-foreground font-medium">
									{typeof currentOrder.customer === "object"
										? currentOrder.customer?.name
										: currentOrder.customer}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground font-semibold">Rider</span>
								<span className="text-foreground font-medium">
									{typeof currentOrder.rider === "object"
										? currentOrder.rider?.name
										: currentOrder.rider || "N/A"}
								</span>
							</div>
						</div>
					)}

					{/* Timeline Visual */}
					<div className="relative overflow-x-auto px-6">
						{/* Connecting Line background */}
						<div className="absolute inset-x-[40px] top-[14px] -z-10 h-[3px] bg-gray-200" />

						{/* Colored Progress Line */}
						<div
							className={cn(
								"absolute left-[40px] top-[14px] -z-0 h-[3px] transition-all duration-500",
								isErrorState ? "bg-destructive" : "bg-[#FDB900]",
							)}
							style={{ width: `calc(${progressWidth} - 20px)` }}
						/>

						<ol className="relative z-10 flex w-full items-start justify-between">
							{steps.map((step) => (
								<li
									key={step.key}
									className="-mx-4 flex flex-col items-center gap-1"
									aria-label={`${step.label}: ${step.state === "pending" ? "not yet" : step.state}`}
								>
									{/* Circle Icon */}
									<div
										className={cn(
											"flex size-8 items-center justify-center rounded-full border-[3px] text-sm text-white transition-colors",
											step.state === "done" &&
												"border-[#FDB900] bg-[#FDB900]",
											step.state === "failed" &&
												"bg-destructive border-destructive",
											step.state === "pending" &&
												"border-gray-200 bg-white text-gray-300",
										)}
									>
										{step.state === "done" && <Icon icon="ph:check-bold" />}
										{step.state === "failed" && <Icon icon="ph:x-bold" />}
										{step.state === "pending" && (
											<span className="size-2 rounded-full bg-gray-200" />
										)}
									</div>

									{/* Label */}
									<span
										className={cn(
											"mt-1 whitespace-nowrap text-xs font-semibold text-foreground",
											step.state === "pending" && "text-muted-foreground",
											step.state === "failed" && "text-destructive",
										)}
									>
										{step.label}
									</span>
									<span className="text-muted-foreground min-h-4 whitespace-nowrap text-[11px]">
										{formatStepTime(step.at)}
									</span>
								</li>
							))}
						</ol>
					</div>

					{/* Conditional Action Button */}
					{isErrorState && (
						<div className="space-y-3">
							<div className="bg-destructive/5 border-destructive/20 flex items-center justify-between rounded-lg border px-4 py-3">
								<div className="text-destructive flex items-center gap-2 text-sm font-semibold">
									<Icon icon="ph:warning-circle-bold" width="20" />
									{orderStatusLabel(orderStatus)}
								</div>
								{!showDetails && (
									<Button
										onClick={() => setShowDetails(true)}
										className="bg-destructive hover:bg-destructive/90 h-9 rounded-md px-4 text-sm font-medium text-white shadow-sm transition-all"
									>
										View Details
									</Button>
								)}
							</div>

							{showDetails && (
								<div className="bg-muted text-foreground animate-in slide-in-from-top-2 rounded-lg p-4 text-sm font-medium">
									{ENDED_DETAILS[orderStatus] ??
										`The order was ${orderStatusLabel(orderStatus).toLowerCase()}.`}
								</div>
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

/* eslint-enable */
