"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useWalletReconciliation } from "@/hooks/financeManagement";
import { type WalletMismatch } from "@/types/financeManagement";
import { cn } from "@/lib/utils";

const naira = (value: number) =>
	`${value < 0 ? "-" : ""}₦${Math.abs(value).toLocaleString(undefined, {
		maximumFractionDigits: 2,
	})}`;

const signedNaira = (value: number) => (value > 0 ? `+${naira(value)}` : naira(value));

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
	return (
		<div className="border-border rounded-xl border p-4">
			<p className="text-muted-foreground text-xs">{label}</p>
			<p
				className={cn(
					"mt-1 text-xl font-semibold",
					tone === "good" && "text-emerald-700",
					tone === "bad" && "text-red-700",
				)}
			>
				{value}
			</p>
		</div>
	);
}

function Breakdown({ row }: { row: WalletMismatch }) {
	const parts = [
		`credits ${naira(row.completedCredits)}`,
		row.returnedRefundCredits
			? `returned withdrawals −${naira(row.returnedRefundCredits)}`
			: null,
		row.activeDebits ? `debits −${naira(row.activeDebits)}` : null,
		row.walletOrderSpend ? `wallet orders −${naira(row.walletOrderSpend)}` : null,
	].filter(Boolean);
	return <span className="text-muted-foreground text-xs">{parts.join(" · ")}</span>;
}

export default function ReconciliationTab() {
	const { data, isLoading, isError, isFetching, refetch } = useWalletReconciliation();
	const report = data?.data;

	let content: React.ReactNode;
	if (isLoading) {
		content = (
			<p className="text-muted-foreground text-sm">
				Checking every wallet against its records...
			</p>
		);
	} else if (isError || !report) {
		content = <p className="text-sm text-red-700">Couldn&apos;t run the reconciliation.</p>;
	} else {
		const { summary } = report;
		content = (
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					<Stat label="Wallets checked" value={summary.walletCount.toLocaleString()} />
					<Stat label="Held in wallets" value={naira(summary.totalActual)} />
					<Stat label="Records say" value={naira(summary.totalExpected)} />
					<Stat
						label="Wallets that don't match"
						value={summary.mismatchCount.toLocaleString()}
						tone={summary.mismatchCount ? "bad" : "good"}
					/>
				</div>

				{summary.mismatchCount === 0 ? (
					<div className="flex flex-col items-center gap-2 py-10 text-sm text-emerald-700">
						<Icon icon="lucide:check-circle-2" className="size-8" />
						Every wallet matches its records.
					</div>
				) : (
					<>
						<p className="text-muted-foreground text-sm">
							Wallets hold {naira(summary.surplus)} more than their records explain
							and {naira(Math.abs(summary.shortfall))} less. Largest differences
							first.
							{report.truncated &&
								` Showing the first ${report.mismatches.length} of ${summary.mismatchCount}.`}
						</p>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>User</TableHead>
										<TableHead className="text-right">In wallet</TableHead>
										<TableHead className="text-right">Records say</TableHead>
										<TableHead className="text-right">Difference</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{report.mismatches.map((row) => (
										<TableRow key={row.userId}>
											<TableCell>
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{row.name ?? "Unknown user"}
													</span>
													{row.role && (
														<Badge
															variant="outline"
															className="capitalize"
														>
															{row.role}
														</Badge>
													)}
												</div>
												<p className="text-muted-foreground text-xs">
													{row.email ?? row.phone ?? row.userId}
												</p>
												<Breakdown row={row} />
											</TableCell>
											<TableCell className="text-right">
												{naira(row.actual)}
											</TableCell>
											<TableCell className="text-right">
												{naira(row.expected)}
											</TableCell>
											<TableCell
												className={cn(
													"text-right font-semibold",
													row.difference > 0
														? "text-amber-700"
														: "text-red-700",
												)}
											>
												{signedNaira(row.difference)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</>
				)}
			</div>
		);
	}

	return (
		<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-xl font-medium">Wallet Reconciliation</h2>
					<p className="text-muted-foreground max-w-2xl text-sm">
						Each wallet balance checked against its top-ups, payouts, refunds,
						withdrawals and wallet-paid orders. A plus means the wallet holds more than
						its records explain; a minus means less.
					</p>
					{report && (
						<p className="text-muted-foreground mt-1 text-xs">
							Checked {new Date(report.checkedAt).toLocaleString()}
						</p>
					)}
				</div>
				<Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
					<Icon icon="lucide:refresh-cw" className={cn(isFetching && "animate-spin")} />
					{isFetching ? "Checking..." : "Run again"}
				</Button>
			</div>
			{content}
		</div>
	);
}
