"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PanelHeader } from "@/components/_atoms/OrderAtoms";
import ConfirmReasonModal from "@/components/_modals/ConfirmReasonModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCancelOrder,
	useChangeOrderRider,
	useMarkRiderArrived,
	useOverrideOrderStatus,
} from "@/hooks/customerManagement";
import { useRiders } from "@/hooks/riderManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";
import { orderStatusLabel } from "@/lib/orderStatus";
import {
	canAssignRider,
	canCancel,
	canRemoveRider,
	overrideTargets,
} from "@/lib/orderIntervention";
import { type Order } from "@/types/customerManagement";
import { REFUND_APPROVAL_THRESHOLD } from "./RefundPanel";

const naira = (value: number) => `₦${value.toLocaleString()}`;
const RIDER_CHOICES = 100;

type Pending = "cancel" | "assign" | "remove" | "status" | "arrived" | null;

// Where the rider can be marked as arrived when the app's location check keeps
// refusing them (a wrong store pin, weak GPS)
const arrivalStage = (order: Order): "store" | "customer" | null => {
	if (!order.rider) return null;
	if (["accepted", "preparing", "ready"].includes(order.status) && !order.riderAtVendorAt)
		return "store";
	if (order.status === "picked_up" && !order.orderArrivedAt) return "customer";
	return null;
};

/**
 * Support stepping into a live order: cancel it (superadmins can refund in the
 * same step), put a different rider on it, take the rider off, or move a stuck
 * order forward. Every action asks for confirmation and lands in the audit log.
 */
export default function OrderActionsPanel({ order }: { order?: Order | null }) {
	const { allows, isSuperAdmin } = usePermissions();
	const mayCancel = allows(ACTION_RULES.cancelOrder);
	const mayChangeRider = allows(ACTION_RULES.changeOrderRider);
	const mayOverride = allows(ACTION_RULES.overrideOrderStatus);

	const [pending, setPending] = useState<Pending>(null);
	const [refund, setRefund] = useState(false);
	const [riderId, setRiderId] = useState("");
	const [targetStatus, setTargetStatus] = useState("");

	const cancelOrder = useCancelOrder();
	const changeRider = useChangeOrderRider();
	const overrideStatus = useOverrideOrderStatus();
	const markArrived = useMarkRiderArrived();

	const showRiders = Boolean(order && mayChangeRider && canAssignRider(order));
	const { data: ridersResponse, isLoading: ridersLoading } = useRiders(
		{ status: "Active", kyc: "approved", sort: "name_asc", limit: RIDER_CHOICES },
		{ enabled: showRiders },
	);
	const riders = (ridersResponse?.data ?? []).filter((rider) => rider._id !== order?.rider?._id);

	// Start fresh whenever another order is selected
	useEffect(() => {
		setPending(null);
		setRefund(false);
		setRiderId("");
		setTargetStatus("");
	}, [order?._id]);

	if (!order || !(mayCancel || mayChangeRider || mayOverride)) return null;

	const total = Number(order.totalAmount) || 0;
	const paid = order.paymentStatus === "completed";
	const refundTooLarge = total > REFUND_APPROVAL_THRESHOLD;
	const targets = mayOverride ? overrideTargets(order) : [];
	const showCancel = mayCancel && canCancel(order);
	const showRemove = mayChangeRider && canRemoveRider(order);
	const stage = mayChangeRider ? arrivalStage(order) : null;

	if (!showCancel && !showRiders && !stage && targets.length === 0) {
		return (
			<div className="bg-card border-border rounded-xl border p-6 shadow-sm">
				<PanelHeader title="Order Actions" />
				<p className="text-muted-foreground text-sm">
					This order is {orderStatusLabel(order.status).toLowerCase()}, so there is
					nothing left to change.
				</p>
			</div>
		);
	}

	const done = (message: string) => {
		toast.success(message);
		setPending(null);
		setRefund(false);
		setRiderId("");
		setTargetStatus("");
	};
	const failed = (error: Error) => toast.error(error.message || "Something went wrong");

	const confirm = (reason: string) => {
		if (pending === "cancel") {
			cancelOrder.mutate(
				{ id: order._id, reason, refund: refund && paid && !refundTooLarge },
				{ onSuccess: (res) => done(res.message), onError: failed },
			);
		} else if (pending === "assign" || pending === "remove") {
			changeRider.mutate(
				{
					id: order._id,
					riderId: pending === "assign" ? riderId : null,
					reason: reason || undefined,
				},
				{ onSuccess: (res) => done(res.message), onError: failed },
			);
		} else if (pending === "arrived" && stage) {
			markArrived.mutate(
				{ id: order._id, stage, reason },
				{ onSuccess: (res) => done(res.message), onError: failed },
			);
		} else if (pending === "status") {
			overrideStatus.mutate(
				{ id: order._id, status: targetStatus, reason },
				{ onSuccess: (res) => done(res.message), onError: failed },
			);
		}
	};

	const chosenRider = riders.find((rider) => rider._id === riderId);
	const modal = {
		cancel: {
			title: "Cancel this order?",
			description:
				refund && paid
					? `The order is cancelled and ${naira(total)} goes back to the customer's wallet. The customer, vendor and rider are told.`
					: "The order is cancelled and the customer, vendor and rider are told. No money moves.",
			confirmLabel: "Cancel order",
			reasonRequired: true,
			tone: "danger" as const,
		},
		assign: {
			title: order.rider ? "Change the rider?" : "Assign a rider?",
			description: `${chosenRider?.name ?? "The rider"} gets the order${order.rider ? ` and ${order.rider.name} is taken off it` : ""}. Everyone involved is told.`,
			confirmLabel: order.rider ? "Change rider" : "Assign rider",
			reasonRequired: false,
			tone: "success" as const,
		},
		remove: {
			title: "Remove the rider?",
			description: `${order.rider?.name ?? "The rider"} is taken off the order and it is offered to other riders again.`,
			confirmLabel: "Remove rider",
			reasonRequired: false,
			tone: "danger" as const,
		},
		arrived: {
			title:
				stage === "customer"
					? "Mark the rider as at the customer?"
					: "Mark the rider as at the store?",
			description:
				stage === "customer"
					? "Use this when the rider is with the customer but the app says they're too far away. The customer is told the rider has arrived."
					: "Use this when the rider is at the store but the app says they're too far away (often a wrong store pin: fix it under the vendor's Store controls). The vendor is told the rider has arrived.",
			confirmLabel: "Mark as arrived",
			reasonRequired: true,
			tone: "success" as const,
		},
		status: {
			title: `Mark as ${orderStatusLabel(targetStatus).toLowerCase()}?`,
			description:
				targetStatus === "delivered"
					? "Use this only when the order really was delivered. The vendor and rider are paid as for a normal delivery."
					: "Use this only when the step really happened and the app didn't record it.",
			confirmLabel: "Update status",
			reasonRequired: true,
			tone: "danger" as const,
		},
	};
	const current = pending ? modal[pending] : null;
	const busy =
		cancelOrder.isPending ||
		changeRider.isPending ||
		overrideStatus.isPending ||
		markArrived.isPending;

	return (
		<div className="bg-card border-border space-y-6 rounded-xl border p-6 shadow-sm">
			<PanelHeader title="Order Actions" />

			{showRiders && (
				<section className="space-y-2">
					<Label htmlFor="order-rider">
						{order.rider ? `Rider: ${order.rider.name}` : "No rider yet"}
					</Label>
					<Select value={riderId} onValueChange={setRiderId}>
						<SelectTrigger id="order-rider" aria-label="Choose a rider">
							<SelectValue
								placeholder={ridersLoading ? "Loading riders…" : "Choose a rider"}
							/>
						</SelectTrigger>
						<SelectContent>
							{riders.map((rider) => (
								<SelectItem key={rider._id} value={rider._id}>
									{rider.name} (
									{rider.riderProfile?.availabilityStatus ?? "offline"})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className="flex flex-wrap gap-2">
						<Button
							size="sm"
							disabled={!riderId || busy}
							onClick={() => setPending("assign")}
						>
							{order.rider ? "Change rider" : "Assign rider"}
						</Button>
						{showRemove && (
							<Button
								size="sm"
								variant="outline"
								disabled={busy}
								onClick={() => setPending("remove")}
							>
								Remove rider
							</Button>
						)}
					</div>
				</section>
			)}

			{stage && (
				<section className="space-y-2">
					<Label>Rider stuck on &quot;I have arrived&quot;?</Label>
					<p className="text-muted-foreground text-xs">
						{order.rider?.name ?? "The rider"} hasn&apos;t checked in at the{" "}
						{stage === "store" ? "store" : "customer"} yet.
					</p>
					<Button
						size="sm"
						variant="outline"
						disabled={busy}
						onClick={() => setPending("arrived")}
					>
						{stage === "store" ? "Mark as at the store" : "Mark as at the customer"}
					</Button>
				</section>
			)}

			{targets.length > 0 && (
				<section className="space-y-2">
					<Label htmlFor="order-status">Move a stuck order forward</Label>
					<Select value={targetStatus} onValueChange={setTargetStatus}>
						<SelectTrigger id="order-status" aria-label="New status">
							<SelectValue placeholder="New status" />
						</SelectTrigger>
						<SelectContent>
							{targets.map((status) => (
								<SelectItem key={status} value={status}>
									{orderStatusLabel(status)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						size="sm"
						variant="outline"
						disabled={!targetStatus || busy}
						onClick={() => setPending("status")}
					>
						Update status
					</Button>
				</section>
			)}

			{showCancel && (
				<section className="space-y-3">
					{isSuperAdmin && paid && (
						<div className="flex items-start gap-2">
							<Checkbox
								id="cancel-refund"
								checked={refund}
								disabled={refundTooLarge}
								onCheckedChange={(checked) => setRefund(checked === true)}
							/>
							<Label
								htmlFor="cancel-refund"
								className="text-sm font-normal leading-snug"
							>
								Refund {naira(total)} to the customer&apos;s wallet
								{refundTooLarge && (
									<span className="text-muted-foreground block text-xs">
										Over {naira(REFUND_APPROVAL_THRESHOLD)} needs a second
										admin: use the Refund panel.
									</span>
								)}
							</Label>
						</div>
					)}
					<Button
						variant="destructive"
						className="w-full"
						disabled={busy}
						onClick={() => setPending("cancel")}
					>
						Cancel order
					</Button>
				</section>
			)}

			{current && (
				<ConfirmReasonModal
					isOpen
					onOpenChange={(open) => !open && setPending(null)}
					onConfirm={confirm}
					title={current.title}
					description={current.description}
					confirmLabel={current.confirmLabel}
					reasonRequired={current.reasonRequired}
					placeholder="Explain why. This goes in the audit log."
					tone={current.tone}
					isLoading={busy}
				/>
			)}
		</div>
	);
}
