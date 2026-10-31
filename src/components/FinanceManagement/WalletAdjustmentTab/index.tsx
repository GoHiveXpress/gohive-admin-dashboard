"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	useDecideWalletAdjustment,
	useRequestWalletAdjustment,
	useWalletAdjustments,
} from "@/hooks/financeManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";
import { type WalletAdjustment, type WalletAdjustmentStatus } from "@/types/financeManagement";
import { cn } from "@/lib/utils";

const naira = (value: number) => `₦${value.toLocaleString()}`;
const MIN_REASON = 10;

const STATUS_STYLES: Record<WalletAdjustmentStatus, string> = {
	pending: "bg-amber-500/10 text-amber-700 border-amber-500/30",
	approved: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
	rejected: "bg-red-500/10 text-red-700 border-red-500/30",
	withdrawn: "bg-muted text-muted-foreground border-border",
	failed: "bg-red-500/10 text-red-700 border-red-500/30",
};

type Decision = { adjustment: WalletAdjustment; action: "approve" | "reject" | "withdraw" };

export const accountName = (adjustment: WalletAdjustment) =>
	adjustment.user?.vendorProfile?.businessName ??
	adjustment.user?.name ??
	adjustment.user?.email ??
	"Unknown account";

const signedAmount = (adjustment: WalletAdjustment) =>
	`${adjustment.type === "credit" ? "+" : "−"}${naira(adjustment.amount)}`;

function RequestForm({ maxAmount }: { maxAmount: number }) {
	const [account, setAccount] = useState("");
	const [type, setType] = useState<"credit" | "debit">("credit");
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");
	const [order, setOrder] = useState("");
	// One key per filled-in form, so a retried submit can't ask twice.
	const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
	const { mutate: requestAdjustment, isPending } = useRequestWalletAdjustment();

	const value = Number(amount.replace(/[₦,\s]/g, ""));
	let error = "";
	if (amount && (!Number.isFinite(value) || value <= 0)) error = "Enter an amount above zero.";
	else if (value > maxAmount) error = `Adjustments are limited to ${naira(maxAmount)}.`;
	const canSubmit =
		account.trim() && value > 0 && !error && reason.trim().length >= MIN_REASON && !isPending;

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!canSubmit) return;
		requestAdjustment(
			{
				account: account.trim(),
				type,
				amount: value,
				reason: reason.trim(),
				order: order.trim() || undefined,
				idempotencyKey,
			},
			{
				onSuccess: (res) => {
					toast.success(res.message);
					setAccount("");
					setAmount("");
					setReason("");
					setOrder("");
					setIdempotencyKey(crypto.randomUUID());
				},
				onError: (err) => {
					toast.error(err.message || "Couldn't request the adjustment");
				},
			},
		);
	};

	return (
		<form onSubmit={submit} className="border-border mb-6 rounded-xl border p-4">
			<h3 className="font-medium">Request an adjustment</h3>
			<p className="text-muted-foreground mb-4 text-sm">
				Nothing moves until another admin with Finance access approves it.
			</p>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="adjust-account">Customer, vendor or rider</Label>
					<Input
						id="adjust-account"
						value={account}
						onChange={(e) => setAccount(e.target.value)}
						placeholder="Email, phone or account ID"
					/>
				</div>
				<div className="flex gap-3">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="adjust-type">Type</Label>
						<Select
							value={type}
							onValueChange={(next) => setType(next === "debit" ? "debit" : "credit")}
						>
							<SelectTrigger id="adjust-type" className="w-[130px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="credit">Credit (add)</SelectItem>
								<SelectItem value="debit">Debit (take)</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-1 flex-col gap-1.5">
						<Label htmlFor="adjust-amount">Amount (₦)</Label>
						<Input
							id="adjust-amount"
							inputMode="decimal"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0"
							aria-invalid={!!error}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-1.5 md:col-span-2">
					<Label htmlFor="adjust-reason">Reason</Label>
					<Textarea
						id="adjust-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="e.g. Goodwill credit: rider delivered the wrong order"
						rows={2}
					/>
					<p className="text-muted-foreground text-xs">
						At least {MIN_REASON} characters. The account holder sees the amount, not
						the reason.
					</p>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="adjust-order">Order (optional)</Label>
					<Input
						id="adjust-order"
						value={order}
						onChange={(e) => setOrder(e.target.value)}
						placeholder="GH-123456"
					/>
				</div>
				<div className="flex items-end justify-end">
					<Button type="submit" disabled={!canSubmit}>
						{isPending ? "Sending..." : "Request approval"}
					</Button>
				</div>
			</div>
			{error && <p className="text-destructive mt-2 text-sm">{error}</p>}
		</form>
	);
}

function DecisionDialog({ decision, onClose }: { decision: Decision | null; onClose: () => void }) {
	const [note, setNote] = useState("");
	const { mutate: decide, isPending } = useDecideWalletAdjustment();

	if (!decision) return null;
	const { adjustment, action } = decision;
	const who = accountName(adjustment);
	const noteRequired = action === "reject";
	const canSubmit = !noteRequired || note.trim().length >= 3;
	const verb = adjustment.type === "credit" ? "added to" : "taken from";

	const titles = {
		approve: `Approve ${signedAmount(adjustment)} for ${who}?`,
		reject: `Reject this ${adjustment.type}?`,
		withdraw: "Withdraw your adjustment request?",
	};
	const buttons = { approve: "Approve and apply", reject: "Reject", withdraw: "Withdraw" };

	let description = "The request is cancelled and no money moves.";
	if (action === "approve") {
		description = `${naira(adjustment.amount)} is ${verb} ${who}'s wallet straight away and they are notified. This can't be undone.`;
	} else if (action === "reject") {
		description = `No money moves. ${adjustment.requestedByName ?? "The requester"} sees your reason.`;
	}

	const close = () => {
		if (isPending) return;
		setNote("");
		onClose();
	};

	const submit = () => {
		decide(
			{
				id: adjustment._id,
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
				onError: (err) => {
					toast.error(err.message || "Couldn't update the adjustment");
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
				<p className="text-sm">&ldquo;{adjustment.reason}&rdquo;</p>
				{action !== "withdraw" && (
					<div className="space-y-2">
						<Label htmlFor="adjust-decision-note">
							{noteRequired ? "Reason for rejecting" : "Note (optional)"}
						</Label>
						<Textarea
							id="adjust-decision-note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
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

function AdjustmentCard({
	adjustment,
	onDecide,
}: {
	adjustment: WalletAdjustment;
	onDecide: (decision: Decision) => void;
}) {
	const isPending = adjustment.status === "pending";

	return (
		<div className="border-border rounded-xl border p-4">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<div className="flex items-center gap-2">
						<span
							className={cn(
								"text-lg font-semibold",
								adjustment.type === "credit" ? "text-emerald-700" : "text-red-700",
							)}
						>
							{signedAmount(adjustment)}
						</span>
						<Badge
							variant="outline"
							className={cn("capitalize", STATUS_STYLES[adjustment.status])}
						>
							{adjustment.status}
						</Badge>
					</div>
					<p className="text-muted-foreground mt-1 text-sm">
						{accountName(adjustment)}
						{adjustment.user?.role && ` · ${adjustment.user.role}`}
						{adjustment.user?.phone && ` · ${adjustment.user.phone}`}
						{adjustment.order && ` · order #${adjustment.order.orderId}`}
					</p>
				</div>

				{isPending && (
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() =>
								onDecide({
									adjustment,
									action: adjustment.isMine ? "withdraw" : "reject",
								})
							}
						>
							{adjustment.isMine ? "Withdraw" : "Reject"}
						</Button>
						{adjustment.canApprove && (
							<Button
								size="sm"
								onClick={() => onDecide({ adjustment, action: "approve" })}
							>
								Approve
							</Button>
						)}
					</div>
				)}
			</div>

			<p className="mt-3 text-sm">&ldquo;{adjustment.reason}&rdquo;</p>

			<div className="text-muted-foreground mt-3 space-y-1 text-xs">
				<p>
					Requested by {adjustment.requestedByName ?? "an admin"}
					{adjustment.isMine && " (you)"} ·{" "}
					{new Date(adjustment.createdAt).toLocaleString()}
				</p>
				{isPending && adjustment.isMine && (
					<p>Another admin with Finance access has to approve this.</p>
				)}
				{adjustment.decidedAt && (
					<p>
						<span className="capitalize">{adjustment.status}</span> by{" "}
						{adjustment.decidedByName ?? "an admin"} ·{" "}
						{new Date(adjustment.decidedAt).toLocaleString()}
						{adjustment.decisionNote && ` — "${adjustment.decisionNote}"`}
					</p>
				)}
				{adjustment.failureReason && (
					<p className="text-red-700">Not applied: {adjustment.failureReason}</p>
				)}
			</div>
		</div>
	);
}

export default function WalletAdjustmentTab() {
	const [filter, setFilter] = useState<"pending" | "all">("pending");
	const [decision, setDecision] = useState<Decision | null>(null);
	const { data, isLoading, isError } = useWalletAdjustments(filter);
	const { allows } = usePermissions();
	const adjustments = data?.data ?? [];

	let content: React.ReactNode;
	if (isLoading) {
		content = <p className="text-muted-foreground text-sm">Loading adjustments...</p>;
	} else if (isError) {
		content = <p className="text-sm text-red-700">Couldn&apos;t load wallet adjustments.</p>;
	} else if (adjustments.length === 0) {
		content = (
			<div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-sm">
				<Icon icon="lucide:check-circle-2" className="size-8" />
				{filter === "pending"
					? "No adjustments waiting for approval."
					: "No wallet adjustments yet."}
			</div>
		);
	} else {
		content = (
			<div className="space-y-3">
				{adjustments.map((adjustment) => (
					<AdjustmentCard
						key={adjustment._id}
						adjustment={adjustment}
						onDecide={setDecision}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-xl font-medium">Wallet Adjustments</h2>
					<p className="text-muted-foreground text-sm">
						Manual credits and debits. Each needs a reason and a second admin&apos;s
						approval, and shows in the ledger as a manual adjustment.
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

			{allows(ACTION_RULES.manageMoney) && (
				<RequestForm maxAmount={data?.maxAmount ?? 1000000} />
			)}

			{content}

			<DecisionDialog decision={decision} onClose={() => setDecision(null)} />
		</div>
	);
}
