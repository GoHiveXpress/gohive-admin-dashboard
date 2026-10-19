"use client";

import { Icon } from "@iconify/react";
import { useOrders, useOrderStats, useAlertVendor } from "@/hooks/customerManagement";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";
import { type Order } from "@/types/customerManagement";
import AlertVendorCard, { type OrderCardData } from "../AlertVendorCards";

interface LiveOrderVendorCardsProps {
	searchQuery: string;
	status: string;
	dateFilter: string;
}

export default function LiveOrderVendorCards({
	searchQuery,
	status,
	dateFilter,
}: LiveOrderVendorCardsProps) {
	const { data: orderResponse, isLoading } = useOrders({});
	const { data: statsResponse } = useOrderStats();
	const { mutate: alertVendor, isPending: isAlerting, variables } = useAlertVendor();
	const toast = useToast();
	const { allows } = usePermissions();
	const mayAlertVendors = allows(ACTION_RULES.alertVendor);

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

	const processedOrders = useMemo(() => {
		let result: Order[] = [...(orderResponse?.data ?? [])];

		// By default "Live" implies we ideally don't show completely finished orders unless heavily requested
		// However, adhering to user filters:

		if (searchQuery.trim() !== "") {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.orderId?.toLowerCase().includes(query) ||
					item._id?.toLowerCase().includes(query) ||
					item.vendor?.vendorProfile?.businessName?.toLowerCase().includes(query) ||
					item.customer?.name?.toLowerCase().includes(query),
			);
		}

		if (status !== "all") {
			result = result.filter((item) => item.status === status);
		}

		if (dateFilter !== "all") {
			const now = new Date();
			result = result.filter((item) => {
				if (!item.createdAt) return false;
				const itemDate = new Date(item.createdAt);
				if (dateFilter === "today") return itemDate.toDateString() === now.toDateString();
				if (dateFilter === "week") {
					const sevenDaysAgo = new Date(now);
					sevenDaysAgo.setDate(now.getDate() - 7);
					sevenDaysAgo.setHours(0, 0, 0, 0);
					return itemDate >= sevenDaysAgo;
				}
				if (dateFilter === "month") {
					const thirtyAgo = new Date(now);
					thirtyAgo.setDate(now.getDate() - 30);
					thirtyAgo.setHours(0, 0, 0, 0);
					return itemDate >= thirtyAgo;
				}
				return true;
			});
		}

		return result.map((order): OrderCardData => {
			const vendorName = order.vendor?.vendorProfile?.businessName ?? "Unknown Vendor";
			const time = new Date(order.createdAt).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});

			const items = (order.items ?? []).map(
				(item) => `${item.quantity} X ${item.name ?? "Item"}`,
			);

			return {
				id: order._id,
				vendorName,
				time,
				eta: order.estimatedTime ?? "10 mins",
				status: order.status,
				items,
			};
		});
	}, [orderResponse?.data, searchQuery, status, dateFilter]);

	return (
		<div className="mt-6 flex flex-col gap-6 lg:flex-row">
			{/* Left Side: Live Order Stats */}
			<div className="w-full shrink-0 space-y-6 lg:w-[240px]">
				<div className="mb-4 flex items-center gap-2">
					<Icon icon="ph:broadcast-bold" className="text-secondary size-6" />
					<h2 className="text-foreground text-lg font-bold">Live Orders</h2>
				</div>

				{/* Stats List */}
				<div className="space-y-3">
					{/* Pending */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="bg-primary/20 text-primary flex size-8 items-center justify-center rounded-full">
							<Icon icon="ph:clock-fill" width="16" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Pending</span>
							<span className="text-lg font-bold">{stats.pending || 0}</span>
						</div>
					</div>

					{/* Placed */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="bg-primary flex size-8 items-center justify-center rounded-full text-white">
							<Icon icon="ph:check-circle-fill" width="16" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Placed</span>
							<span className="text-lg font-bold">{stats.placed || 0}</span>
						</div>
					</div>

					{/* Accepted */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
							<Icon icon="ph:thumbs-up-fill" width="16" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Accepted</span>
							<span className="text-lg font-bold">{stats.accepted || 0}</span>
						</div>
					</div>

					{/* Preparing  */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-white">
							<Icon icon="ph:cooking-pot-fill" width="16" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Preparing</span>
							<span className="text-lg font-bold">{stats.preparing || 0}</span>
						</div>
					</div>

					{/* Ready */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600">
							<Icon icon="ph:package-fill" width="16" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Ready</span>
							<span className="text-lg font-bold">{stats.ready || 0}</span>
						</div>
					</div>

					{/* Picked up */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white">
							<Icon icon="ph:moped-fill" width="16" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Picked Up</span>
							<span className="text-lg font-bold">{stats.picked_up || 0}</span>
						</div>
					</div>

					{/* Delivered */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="flex size-8 items-center justify-center rounded-full bg-green-700 text-white">
							<Icon icon="ph:house-line-fill" width="16" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Delivered</span>
							<span className="text-lg font-bold">{stats.delivered || 0}</span>
						</div>
					</div>

					{/* Failed / Rejected / Cancelled / Expired Grouping (Visually distinct but mapped natively) */}
					<div className="border-border/50 mt-4 space-y-3 border-t pt-4">
						<div className="bg-destructive/5 flex items-center gap-4 rounded-lg p-2">
							<div className="text-destructive flex size-8 items-center justify-center rounded-full">
								<Icon icon="ph:warning-circle-fill" width="16" />
							</div>
							<div className="flex flex-1 items-center justify-between">
								<span className="text-destructive text-sm font-medium">
									Failed/Expired
								</span>
								<span className="text-destructive text-lg font-bold">
									{stats.payment_failed + stats.expired || 0}
								</span>
							</div>
						</div>
						<div className="bg-destructive/5 flex items-center gap-4 rounded-lg p-2">
							<div className="text-destructive flex size-8 items-center justify-center rounded-full">
								<Icon icon="ph:x-circle-fill" width="16" />
							</div>
							<div className="flex flex-1 items-center justify-between">
								<span className="text-destructive text-sm font-medium">
									Rejected/Cancelled
								</span>
								<span className="text-destructive text-lg font-bold">
									{stats.rejected + stats.cancelled || 0}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side: Cards Grid */}
			<div className="flex-1">
				{isLoading && (
					<div className="flex h-64 items-center justify-center">
						<Loader2 className="text-secondary size-8 animate-spin" />
					</div>
				)}
				{!isLoading && processedOrders.length === 0 && (
					<div className="text-muted-foreground py-20 text-center">
						No live orders matching filters.
					</div>
				)}
				{!isLoading && processedOrders.length > 0 && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
						{processedOrders.map((order) => {
							// Determine if this specific order is being alerted
							const isThisOrderAlerting =
								isAlerting && variables?.orderId === order.id;

							// Only allow alerting if status is placed or pending (not yet accepted)
							const canAlert =
								mayAlertVendors &&
								(order.status === "placed" || order.status === "pending");

							return (
								<AlertVendorCard
									key={order.id}
									data={order}
									isAlerting={isThisOrderAlerting}
									onAlertVendor={
										canAlert
											? (orderId) => {
													alertVendor(
														{ orderId },
														{
															onSuccess: () =>
																toast.success(
																	"Vendor alerted successfully",
																),
															onError: () =>
																toast.error(
																	"Failed to alert vendor",
																),
														},
													);
												}
											: undefined
									}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
