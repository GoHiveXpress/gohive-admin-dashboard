// src/components/_widgets/ExceptionsQueue/index.tsx
// Orders stuck past their stage's time limit, critical first, with quick
// actions. Data: GET /admin/ops/exceptions, refreshed by socket events and a
// 30s timer (orders turn late without any write happening).

"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import OrderProcessModal from "@/components/_modals/OrderProcessModal";
import { type OrderHistory } from "@/components/Tables/columns/orderHistoryColumns";
import { useNow, useOpsExceptions } from "@/hooks/useOps";
import { type ExceptionType, type OpsException } from "@/types/ops";

const MINUTE = 60 * 1000;

const toOrderHistory = ({ order }: OpsException): OrderHistory => ({
	_id: order._id,
	orderId: order.orderId,
	status: order.status,
	createdAt: order.createdAt,
	totalAmount: order.totalAmount,
	vendor: { vendorProfile: { businessName: order.vendor?.name ?? "Unknown vendor" } },
	deliveryAddress: order.address ? { address: order.address } : undefined,
	customer: { name: order.customer?.name ?? "Unknown customer" },
	rider: order.rider?.name ? { name: order.rider.name } : undefined,
});

function CallLink({ phone, label }: { phone?: string; label: string }) {
	if (!phone) return null;
	return (
		<a
			href={`tel:${phone}`}
			className="border-border text-foreground hover:bg-muted flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors"
			title={`Call ${label} (${phone})`}
		>
			<Icon icon="ph:phone-bold" width="14" />
			{label}
		</a>
	);
}

function ExceptionRow({
	item,
	now,
	onView,
}: {
	item: OpsException;
	now: number;
	onView: (row: OpsException) => void;
}) {
	// Count from `since` locally so the wait keeps ticking between refetches.
	const minutes = Math.max(
		item.minutes,
		Math.floor((now - new Date(item.since).getTime()) / MINUTE),
	);
	const isCritical = item.severity === "critical";
	const { order } = item;

	return (
		<li className="border-border/40 flex flex-col gap-3 border-b py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
			<div className="flex min-w-0 items-start gap-3">
				<span
					className={`mt-1.5 size-2.5 shrink-0 rounded-full ${isCritical ? "bg-destructive" : "bg-amber-500"}`}
					aria-hidden="true"
				/>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-foreground text-sm font-semibold">{item.label}</span>
						<span
							className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
								isCritical
									? "bg-destructive/10 text-destructive"
									: "bg-amber-50 text-amber-700"
							}`}
						>
							{minutes} min
							<span className="font-normal opacity-80">
								{" "}
								/ limit {item.thresholdMinutes}
							</span>
						</span>
					</div>
					<p className="text-muted-foreground mt-1 truncate text-xs">
						<span className="text-foreground font-medium">{order.orderId}</span>
						{" · "}
						{order.vendor?.name ?? "Unknown vendor"}
						{" · "}
						{order.rider?.name ? `Rider: ${order.rider.name}` : "No rider"}
						{order.customer?.name ? ` · ${order.customer.name}` : ""}
						{order.state ? ` · ${order.state}` : ""}
					</p>
				</div>
			</div>
			<div className="flex shrink-0 flex-wrap items-center gap-2 pl-5 md:pl-0">
				<CallLink phone={order.vendor?.phone} label="Vendor" />
				<CallLink phone={order.rider?.phone} label="Rider" />
				<CallLink phone={order.customer?.phone} label="Customer" />
				<button
					type="button"
					onClick={() => onView(item)}
					className="bg-secondary hover:bg-secondary/90 flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-white transition-colors"
				>
					<Icon icon="ph:eye-bold" width="14" />
					View
				</button>
			</div>
		</li>
	);
}

export default function ExceptionsQueue({ isLive }: { isLive: boolean }) {
	const { data, isLoading, isError, dataUpdatedAt } = useOpsExceptions();
	const now = useNow();
	const [filter, setFilter] = useState<ExceptionType | "all">("all");
	const [selected, setSelected] = useState<OrderHistory | null>(null);

	const queue = data?.data;
	const items = useMemo(() => {
		const all = queue?.items ?? [];
		return filter === "all" ? all : all.filter((item) => item.type === filter);
	}, [queue, filter]);

	const chips = (queue?.rules ?? [])
		.map((rule) => ({ ...rule, count: queue?.counts.byType[rule.type] ?? 0 }))
		.filter((rule) => rule.count > 0);

	const updatedSecondsAgo = dataUpdatedAt
		? Math.max(0, Math.round((now - dataUpdatedAt) / 1000))
		: null;

	return (
		<div className="border-border/50 flex h-full flex-col rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<h3 className="text-foreground text-lg font-semibold">Needs attention</h3>
					{queue && queue.counts.critical > 0 && (
						<span className="bg-destructive/10 text-destructive rounded-full px-2.5 py-0.5 text-xs font-semibold">
							{queue.counts.critical} critical
						</span>
					)}
					{queue && queue.counts.warning > 0 && (
						<span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
							{queue.counts.warning} warning
						</span>
					)}
				</div>
				<div className="text-muted-foreground flex items-center gap-2 text-xs">
					<span
						className={`size-2 rounded-full ${isLive ? "bg-secondary animate-pulse" : "bg-muted-foreground/40"}`}
						aria-hidden="true"
					/>
					{isLive ? "Live" : "Reconnecting, refreshing every 30s"}
					{updatedSecondsAgo !== null && <span>· updated {updatedSecondsAgo}s ago</span>}
				</div>
			</div>

			{chips.length > 1 && (
				<div className="mb-2 flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => setFilter("all")}
						className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
							filter === "all"
								? "bg-secondary text-white"
								: "bg-muted text-foreground hover:bg-muted/70"
						}`}
					>
						All {queue?.counts.total}
					</button>
					{chips.map((chip) => (
						<button
							key={chip.type}
							type="button"
							onClick={() => setFilter(chip.type)}
							className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
								filter === chip.type
									? "bg-secondary text-white"
									: "bg-muted text-foreground hover:bg-muted/70"
							}`}
						>
							{chip.label} {chip.count}
						</button>
					))}
				</div>
			)}

			{isLoading && (
				<div className="space-y-3 pt-2">
					{[0, 1, 2].map((key) => (
						<Skeleton key={key} className="h-14 w-full rounded-xl" />
					))}
				</div>
			)}

			{isError && !queue && (
				<p className="text-muted-foreground py-8 text-center text-sm">
					The queue couldn&apos;t be loaded. It will retry automatically.
				</p>
			)}

			{queue && items.length === 0 && (
				<div className="flex flex-col items-center gap-2 py-10 text-center">
					<Icon icon="ph:check-circle-fill" className="text-secondary" width="36" />
					<p className="text-foreground text-sm font-medium">
						Every active order is on time
					</p>
					<p className="text-muted-foreground text-xs">
						{queue.activeOrders.toLocaleString()} active order
						{queue.activeOrders === 1 ? "" : "s"} right now
					</p>
				</div>
			)}

			{items.length > 0 && (
				<ul className="max-h-[480px] overflow-y-auto pr-1">
					{items.map((item) => (
						<ExceptionRow
							key={`${item.type}-${item.order._id}`}
							item={item}
							now={now}
							onView={(row) => setSelected(toOrderHistory(row))}
						/>
					))}
				</ul>
			)}

			<OrderProcessModal
				isOpen={selected !== null}
				onClose={() => setSelected(null)}
				data={selected}
			/>
		</div>
	);
}
