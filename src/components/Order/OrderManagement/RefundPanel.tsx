"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PanelHeader } from "@/components/_atoms/OrderAtoms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProcessRefund, useRefundLogs } from "@/hooks/financeManagement";

// Same list as the backend: an order can be cancelled with its refund until delivery
const CANCELLABLE_STATUSES = ["pending", "placed", "accepted", "preparing", "ready", "picked_up"];

const naira = (value: number) => `₦${value.toLocaleString()}`;

interface RefundPanelProps {
	order?: {
		_id: string;
		orderId?: string;
		status: string;
		paymentStatus?: string;
		paymentMethod?: string;
		totalAmount?: number;
		customer?: { name?: string };
	};
}

/**
 * Superadmin-only: credit some or all of a paid order back to the customer's wallet,
 * optionally cancelling the order if it is still in progress. One refund per order.
 */
export default function RefundPanel({ order }: RefundPanelProps) {
	const { data: session } = useSession();
	const isSuperAdmin = session?.user?.role === "superadmin";

	const total = Number(order?.totalAmount) || 0;
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");
	const [cancelOrder, setCancelOrder] = useState(false);
	const [confirming, setConfirming] = useState(false);

	const { mutate: processRefund, isPending } = useProcessRefund();
	const { data: logs, isLoading: logsLoading } = useRefundLogs(
		{ search: order?.orderId },
		{ enabled: isSuperAdmin && Boolean(order?.orderId) },
	);
	const existingRefund = logs?.data?.find((log) => String(log.dbOrderId) === order?._id);

	// Start fresh whenever another order is selected
	useEffect(() => {
		setAmount(total ? String(total) : "");
		setReason("");
		setCancelOrder(false);
		setConfirming(false);
	}, [order?._id, total]);

	if (!isSuperAdmin || !order) return null;

	const value = Number(amount);
	const amountError =
		amount === ""
			? "Enter an amount"
			: !Number.isFinite(value) || value <= 0
				? "Enter an amount above ₦0"
				: value > total
					? `Can't be more than the order total of ${naira(total)}`
					: null;
	const canCancel = CANCELLABLE_STATUSES.includes(order.status);
	const canSubmit = !amountError && reason.trim().length > 0;

	const submit = () => {
		processRefund(
			{
				orderId: order._id,
				amount: value,
				reason: reason.trim(),
				cancelOrder: canCancel && cancelOrder,
			},
			{
				onSuccess: (res) => {
					toast.success(res.message);
					setConfirming(false);
				},
				onError: (error) => {
					toast.error(error.message || "Failed to process refund");
					setConfirming(false);
				},
			},
		);
	};

	let body: React.ReactNode;
	if (logsLoading) {
		body = (
			<div className="flex justify-center py-4">
				<Loader2 className="text-secondary animate-spin" />
			</div>
		);
	} else if (existingRefund) {
		body = (
			<div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm">
				<p className="text-foreground font-medium">
					Refunded {existingRefund.refundAmount} on{" "}
					{new Date(existingRefund.createdAt).toLocaleDateString()}
				</p>
				<p className="text-muted-foreground mt-1">Reason: {existingRefund.reason}</p>
				<p className="text-muted-foreground mt-2 text-xs">
					An order can only be refunded once.
				</p>
			</div>
		);
	} else if (order.paymentStatus !== "completed") {
		body = (
			<p className="text-muted-foreground rounded-lg border p-4 text-sm">
				This order hasn&apos;t been paid (payment {order.paymentStatus || "unknown"}), so
				there is nothing to refund.
			</p>
		);
	} else {
		body = (
			<div className="space-y-4">
				<div className="space-y-1.5">
					<Label htmlFor="refund-amount">Refund amount (₦)</Label>
					<Input
						id="refund-amount"
						type="number"
						inputMode="decimal"
						min={1}
						max={total}
						step="0.01"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="h-11 bg-transparent"
					/>
					<p
						className={`text-xs ${amountError && amount !== "" ? "text-destructive" : "text-muted-foreground"}`}
					>
						{amountError && amount !== ""
							? amountError
							: `Order total ${naira(total)}, paid by ${order.paymentMethod || "unknown"}`}
					</p>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="refund-reason">Reason</Label>
					<Textarea
						id="refund-reason"
						placeholder="e.g. Item missing from the delivery"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						maxLength={300}
						className="min-h-[80px] resize-none bg-transparent"
					/>
					<p className="text-muted-foreground text-xs">
						The customer sees this in their wallet history.
					</p>
				</div>

				{canCancel && (
					<div className="flex items-start gap-2">
						<Checkbox
							id="refund-cancel"
							checked={cancelOrder}
							onCheckedChange={(checked) => setCancelOrder(checked === true)}
						/>
						<Label htmlFor="refund-cancel" className="text-sm font-normal leading-snug">
							Also cancel this order (the vendor and rider are notified)
						</Label>
					</div>
				)}

				<Button
					disabled={!canSubmit}
					onClick={() => setConfirming(true)}
					className="bg-secondary hover:bg-secondary/90 h-11 w-full text-base font-medium text-white"
				>
					Process Refund
				</Button>
			</div>
		);
	}

	return (
		<div className="bg-card border-border rounded-xl border p-6 shadow-sm">
			<PanelHeader title="Refund" />
			{body}

			<Dialog open={confirming} onOpenChange={(open) => !isPending && setConfirming(open)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Refund {Number.isFinite(value) ? naira(value) : ""}?
						</DialogTitle>
						<DialogDescription>
							{naira(value || 0)} goes to {order.customer?.name || "the customer"}
							&apos;s GoHive wallet straight away for order #
							{order.orderId?.slice(-6) || order._id.slice(-6)}.
							{canCancel && cancelOrder && " The order will also be cancelled."} This
							can&apos;t be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							disabled={isPending}
							onClick={() => setConfirming(false)}
						>
							Go back
						</Button>
						<Button
							disabled={isPending}
							onClick={submit}
							className="bg-secondary hover:bg-secondary/90 text-white"
						>
							{isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
							Confirm refund
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
