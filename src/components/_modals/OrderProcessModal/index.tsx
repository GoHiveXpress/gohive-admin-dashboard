"use client";

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { type OrderHistory } from "@/components/Tables/columns/orderHistoryColumns";
import { useOrder } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderProcessModalProps {
	isOpen: boolean;
	onClose: () => void;
	data: OrderHistory | null;
}

export default function OrderProcessModal({ isOpen, onClose, data }: OrderProcessModalProps) {
	// Poll for the latest order data in real time
	const { data: orderResponse, isLoading } = useOrder(data?._id || "");
	const currentOrder = orderResponse?.data || data;

	const [showDetails, setShowDetails] = useState(false);

	if (!isOpen || !currentOrder) return null;

	const orderStatus = currentOrder.status;

	// Timeline Configuration aligned with exact backend statuses
	const steps = [
		{ label: "Placed", key: "placed" },
		{ label: "Accepted", key: "accepted" },
		{ label: "Preparing", key: "preparing" },
		{ label: "Ready", key: "ready" },
		{ label: "Picked Up", key: "picked_up" },
		{ label: "Delivered", key: "delivered" },
	];

	const isErrorState = ["cancelled", "rejected", "payment_failed", "expired"].includes(
		orderStatus,
	);

	// Helper to determine step state
	const getStepState = (stepKey: string) => {
		if (isErrorState) {
			if (stepKey === "placed") return "completed";
			if (stepKey === "accepted") return "error";
			return "pending";
		}

		const statusesOrder = [
			"pending",
			"payment_failed",
			"placed",
			"accepted",
			"preparing",
			"ready",
			"picked_up",
			"delivered",
		];
		const currentIdx = statusesOrder.indexOf(orderStatus);
		const stepIdx = statusesOrder.indexOf(stepKey);

		if (currentIdx >= stepIdx) return "completed";
		return "pending";
	};

	// Calculate Progress Line Width
	let progressWidth = "0%";
	if (isErrorState) {
		progressWidth = "20%"; // Stop early at accepted error
	} else {
		const statusesOrder = [
			"placed",
			"accepted",
			"preparing",
			"ready",
			"picked_up",
			"delivered",
		];
		const currentIdx = statusesOrder.indexOf(orderStatus);
		if (currentIdx !== -1) {
			// max index is 5, percentages calculate to 0%, 20%, 40%, 60%, 80%, 100%
			progressWidth = `${(currentIdx / (steps.length - 1)) * 100}%`;
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
			<div className="animate-in fade-in zoom-in w-full max-w-[700px] overflow-hidden rounded-[20px] bg-white shadow-xl duration-200">
				{/* Header */}
				<div className="flex items-center justify-between p-6 pb-2">
					<h2 className="text-foreground text-xl font-bold">Order Summary</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="bg-muted/50 hover:bg-muted size-8 rounded-full"
					>
						<Icon icon="ph:x-bold" />
					</Button>
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
						<div className="grid grid-cols-4 gap-4 rounded-lg bg-[#F9FAFB] p-4 text-center text-sm">
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
					<div className="relative px-6">
						{/* Connecting Line background */}
						<div className="absolute inset-x-[40px] top-[14px] -z-10 h-[3px] bg-gray-200" />

						{/* Colored Progress Line */}
						<div
							className={`absolute left-[40px] top-[14px] -z-0 h-[3px] transition-all duration-500
                                ${isErrorState ? "bg-destructive" : "bg-[#FDB900]"}
                            `}
							style={{ width: `calc(${progressWidth} - 20px)` }}
						/>

						<div className="relative z-10 flex w-full items-start justify-between">
							{steps.map((step) => {
								const state = getStepState(step.key);

								return (
									<div
										key={step.key}
										className="group -mx-4 flex flex-col items-center gap-2"
									>
										{/* Circle Icon */}
										<div
											className={`
                                            flex size-8 items-center justify-center rounded-full border-[3px] text-sm text-white transition-colors
                                            ${state === "completed" ? "border-[#FDB900] bg-[#FDB900]" : ""}
                                            ${state === "error" ? "bg-destructive border-destructive" : ""}
                                            ${state === "pending" ? "border-gray-200 bg-white text-gray-300" : ""}
                                        `}
										>
											{state === "completed" && <Icon icon="ph:check-bold" />}
											{state === "error" && <Icon icon="ph:x-bold" />}
											{state === "pending" && (
												<span className="size-2 rounded-full bg-gray-200" />
											)}
										</div>

										{/* Label */}
										<span
											className={`whitespace-nowrap text-xs font-semibold 
                                            ${state === "completed" || state === "error" ? "text-foreground" : "text-muted-foreground"}`}
										>
											{step.label}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Conditional Action Button */}
					{isErrorState && (
						<div className="space-y-3">
							<div className="bg-destructive/5 border-destructive/20 flex items-center justify-between rounded-lg border px-4 py-3">
								<div className="text-destructive flex items-center gap-2 text-sm font-semibold">
									<Icon icon="ph:warning-circle-bold" width="20" />
									Order was {orderStatus.replace("_", " ")}
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
									{orderStatus === "expired"
										? "Order was not accepted or delivered and customer full payment refunded."
										: orderStatus === "cancelled"
											? "Order canceled by vendor"
											: `The order was ${orderStatus.replace("_", " ")}.`}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
