"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDecideRefundRequest, useRefundRequests } from "@/hooks/financeManagement";
import { type RefundRequest, type RefundRequestStatus } from "@/types/financeManagement";
import { cn } from "@/lib/utils";

const naira = (value: number) => `₦${value.toLocaleString()}`;

const STATUS_STYLES: Record<RefundRequestStatus, string> = {
	pending: "bg-amber-500/10 text-amber-700 border-amber-500/30",
	approved: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
	rejected: "bg-red-500/10 text-red-700 border-red-500/30",
	withdrawn: "bg-muted text-muted-foreground border-border",
	failed: "bg-red-500/10 text-red-700 border-red-500/30",
};

type Decision = { request: RefundRequest; action: "approve" | "reject" | "withdraw" };

const orderCode = (request: RefundRequest) =>
	`#${(request.order?.orderId ?? request.orderCode ?? request.order?._id ?? "").slice(-6)}`;

function DecisionDialog({ decision, onClose }: { decision: Decision | null; onClose: () => void }) {
	const [note, setNote] = useState("");
	const { mutate: decide, isPending } = useDecideRefundRequest();

	if (!decision) return null;
	const { request, action } = decision;
	const customer = request.customer?.name ?? "the customer";
	const noteRequired = action === "reject";
	const canSubmit = !noteRequired || note.trim().length >= 3;

	const titles = {
		approve: `Approve ${naira(request.amount)} refund?`,
		reject: `Reject ${naira(request.amount)} refund?`,
		withdraw: `Withdraw your ${naira(request.amount)} refund request?`,
	};
	const buttons = { approve: "Approve and pay", reject: "Reject", withdraw: "Withdraw" };

	let description = `The request is cancelled and no money moves.`;
	if (action === "approve") {
		description = `${naira(request.amount)} goes to ${customer}'s GoHive wallet straight away for order ${orderCode(request)}.${request.cancelOrder ? " The order will also be cancelled." : ""} This can't be undone.`;
	} else if (action === "reject") {
		description = `No money moves. ${request.requestedByName ?? "The requester"} is told why.`;
	}

	const close = () => {
		if (isPending) return;
		setNote("");
		onClose();
	};

	const submit = () => {
		decide(
			{
				id: request._id,
				// Withdrawing is a reject by the requester on the backend
				decision: action === "approve" ? "approve" : "reject",
				note: note.trim() || undefined,
			},
			{
				onSuccess: (res) => {
					toast.success(res.message);
					setNote("");
					onClose();
				},
				onError: (error) => {
					toast.error(error.message || "Couldn't update the refund request");
				},
			},
		);
	};

	return (
		<Dialog open onOpenChange={(open) => !open && close()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{titles[action]}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{action !== "withdraw" && (
					<div className="space-y-2">
						<label htmlFor="refund-decision-note" className="text-sm font-medium">
							{noteRequired ? "Reason for rejecting" : "Note (optional)"}
						</label>
						<Textarea
							id="refund-decision-note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder={
								noteRequired ? "e.g. Customer already got a replacement" : ""
							}
							rows={3}
						/>
					</div>
				)}
				<DialogFooter>
					<Button variant="outline" onClick={close} disabled={isPending}>
						Cancel
					</Button>
					<Button
						onClick={submit}
						disabled={!canSubmit || isPending}
						variant={action === "approve" ? "default" : "destructive"}
					>
						{isPending ? "Saving..." : buttons[action]}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function RequestCard({
	request,
	onDecide,
}: {
	request: RefundRequest;
	onDecide: (decision: Decision) => void;
}) {
	const isPending = request.status === "pending";

	return (
		<div className="border-border rounded-xl border p-4">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<div className="flex items-center gap-2">
						<span className="text-lg font-semibold">{naira(request.amount)}</span>
						<Badge
							variant="outline"
							className={cn("capitalize", STATUS_STYLES[request.status])}
						>
							{request.status}
						</Badge>
						{request.cancelOrder && (
							<Badge variant="outline" className="text-xs">
								Cancels order
							</Badge>
						)}
					</div>
					<p className="text-muted-foreground mt-1 text-sm">
						Order {orderCode(request)}
						{request.order && ` · total ${naira(request.order.totalAmount)}`} ·{" "}
						{request.customer?.name ?? "Unknown customer"}
						{request.customer?.phone && ` (${request.customer.phone})`}
					</p>
				</div>

				{isPending && (
					<div className="flex gap-2">
						{request.isMine && (
							<Button
								size="sm"
								variant="outline"
								onClick={() => onDecide({ request, action: "withdraw" })}
							>
								Withdraw
							</Button>
						)}
						{!request.isMine && (
							<Button
								size="sm"
								variant="outline"
								onClick={() => onDecide({ request, action: "reject" })}
							>
								Reject
							</Button>
						)}
						{request.canApprove && (
							<Button
								size="sm"
								onClick={() => onDecide({ request, action: "approve" })}
							>
								Approve
							</Button>
						)}
					</div>
				)}
			</div>

			{request.reason && <p className="mt-3 text-sm">&ldquo;{request.reason}&rdquo;</p>}

			<div className="text-muted-foreground mt-3 space-y-1 text-xs">
				<p>
					Requested by {request.requestedByName ?? "an admin"}
					{request.isMine && " (you)"} · {new Date(request.createdAt).toLocaleString()}
				</p>
				{isPending && request.isMine && (
					<p>Another admin with Finance access has to approve this.</p>
				)}
				{request.decidedAt && (
					<p>
						<span className="capitalize">{request.status}</span> by{" "}
						{request.decidedByName ?? "an admin"} ·{" "}
						{new Date(request.decidedAt).toLocaleString()}
						{request.decisionNote && ` — "${request.decisionNote}"`}
					</p>
				)}
				{request.failureReason && (
					<p className="text-red-700">Not paid: {request.failureReason}</p>
				)}
			</div>
		</div>
	);
}

export default function RefundApprovalTab() {
	const [filter, setFilter] = useState<"pending" | "all">("pending");
	const [decision, setDecision] = useState<Decision | null>(null);
	const { data, isLoading, isError } = useRefundRequests(filter);
	const requests = data?.data ?? [];

	let content: React.ReactNode;
	if (isLoading) {
		content = <p className="text-muted-foreground text-sm">Loading refund requests...</p>;
	} else if (isError) {
		content = <p className="text-sm text-red-700">Couldn&apos;t load refund requests.</p>;
	} else if (requests.length === 0) {
		content = (
			<div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-sm">
				<Icon icon="lucide:check-circle-2" className="size-8" />
				{filter === "pending"
					? "No refunds waiting for approval."
					: "No refund requests yet."}
			</div>
		);
	} else {
		content = (
			<div className="space-y-3">
				{requests.map((request) => (
					<RequestCard key={request._id} request={request} onDecide={setDecision} />
				))}
			</div>
		);
	}

	return (
		<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-xl font-medium">Refund Approvals</h2>
					<p className="text-muted-foreground text-sm">
						Refunds over {naira(data?.threshold ?? 5000)} wait here until a second admin
						approves them.
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant={filter === "pending" ? "default" : "outline"}
						onClick={() => setFilter("pending")}
					>
						Waiting{data?.pendingCount ? ` (${data.pendingCount})` : ""}
					</Button>
					<Button
						size="sm"
						variant={filter === "all" ? "default" : "outline"}
						onClick={() => setFilter("all")}
					>
						All
					</Button>
				</div>
			</div>

			{content}

			<DecisionDialog decision={decision} onClose={() => setDecision(null)} />
		</div>
	);
}
