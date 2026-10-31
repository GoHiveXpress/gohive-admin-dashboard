"use client";

import React, { useState } from "react";
import ServerExportButton from "@/components/_atoms/ServerExportButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";
import { toDateInput } from "@/lib/supportTickets";

// Mirrors TRANSACTION_CATEGORIES in gohive-backend/utils/exportDatasets.js
const CATEGORY_LABELS: Record<string, string> = {
	order_payment: "Order payments",
	order_payout: "Order payouts",
	withdrawal: "Withdrawals",
	wallet_topup: "Wallet top-ups",
	refund: "Refunds",
	referral_bonus: "Referral bonuses",
};

const STATUS_LABELS: Record<string, string> = {
	completed: "Completed",
	pending: "Pending",
	failed: "Failed",
};

const startOfMonth = (now: Date) => new Date(now.getFullYear(), now.getMonth(), 1);

/**
 * Every wallet and payment transaction in a date range as one CSV, for
 * bookkeeping and reconciliation outside the dashboard.
 */
export default function LedgerExportTab() {
	const { allows, isLoading } = usePermissions();
	const [from, setFrom] = useState(() => toDateInput(startOfMonth(new Date())));
	const [to, setTo] = useState(() => toDateInput(new Date()));
	const [category, setCategory] = useState("all");
	const [status, setStatus] = useState("all");

	let rangeError: string | null = null;
	if (!from || !to) rangeError = "Pick a start and end date.";
	else if (from > to) rangeError = "The end date must be on or after the start date.";

	return (
		<section className="bg-card border-border flex flex-col gap-5 rounded-xl border p-6">
			<div>
				<h3 className="text-foreground text-lg font-semibold">Transaction ledger</h3>
				<p className="text-muted-foreground mt-1 text-sm">
					Download every transaction that matches these filters: order payments, vendor
					and rider payouts, withdrawals, top-ups, refunds and referral bonuses. Days are
					in Lagos time and both dates are included. Exports are limited to 50,000 rows
					and are recorded in the audit log.
				</p>
			</div>

			<div className="flex flex-wrap items-end gap-4">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="ledger-from">From</Label>
					<Input
						id="ledger-from"
						type="date"
						value={from}
						max={to || undefined}
						onChange={(e) => setFrom(e.target.value)}
						className="w-[160px]"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="ledger-to">To</Label>
					<Input
						id="ledger-to"
						type="date"
						value={to}
						min={from || undefined}
						onChange={(e) => setTo(e.target.value)}
						className="w-[160px]"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="ledger-category">Category</Label>
					<Select value={category} onValueChange={setCategory}>
						<SelectTrigger id="ledger-category" className="w-[190px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All categories</SelectItem>
							{Object.entries(CATEGORY_LABELS).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="ledger-status">Status</Label>
					<Select value={status} onValueChange={setStatus}>
						<SelectTrigger id="ledger-status" className="w-[160px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All statuses</SelectItem>
							{Object.entries(STATUS_LABELS).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<ServerExportButton
					dataset="transactions"
					label="Download CSV"
					disabled={!!rangeError}
					params={{
						from,
						to,
						category: category === "all" ? undefined : category,
						status: status === "all" ? undefined : status,
					}}
				/>
			</div>

			{rangeError && <p className="text-destructive text-sm">{rangeError}</p>}
			{!isLoading && !allows(ACTION_RULES.download) && (
				<p className="text-muted-foreground text-sm">
					You need the Download permission to export the ledger. Ask a super admin to add
					it to your role.
				</p>
			)}
		</section>
	);
}
