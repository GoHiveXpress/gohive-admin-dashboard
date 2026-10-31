// src/components/Customer/CustomerWalletTab/index.tsx
// The customer's wallet balance and every money record, newest first.

"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerWallet } from "@/hooks/useAccountTools";
import { CATEGORY_LABELS, signedAmount } from "@/lib/accountTools";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
	completed: "bg-green-50 text-green-700",
	pending: "bg-amber-50 text-amber-700",
	failed: "bg-destructive/10 text-destructive",
} as const;

export default function CustomerWalletTab({ id }: { id: string }) {
	const [page, setPage] = useState(1);
	const { data, isLoading, isFetching, error } = useCustomerWallet(id, page);

	if (isLoading) {
		return (
			<div className="border-border/50 space-y-4 rounded-[20px] border bg-white p-6 shadow-sm">
				<Skeleton className="h-20 w-full rounded-xl" />
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>
		);
	}

	if (error ?? !data) {
		return (
			<div className="border-border/50 text-destructive rounded-[20px] border bg-white p-6 text-center shadow-sm">
				Failed to load the wallet.
			</div>
		);
	}

	const wallet = data.data;
	const { pagination } = data;

	return (
		<div className="border-border/50 space-y-6 rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
						Balance
					</p>
					<p className="text-foreground text-3xl font-bold tabular-nums">
						₦{wallet.balance.toLocaleString()}
					</p>
				</div>
				{wallet.accountNumber && (
					<p className="text-muted-foreground text-sm">
						Funding account: {wallet.accountNumber}
						{wallet.bankName ? ` · ${wallet.bankName}` : ""}
					</p>
				)}
			</div>

			{wallet.transactions.length === 0 ? (
				<p className="text-muted-foreground p-8 text-center">No wallet activity yet.</p>
			) : (
				<div className={cn("overflow-x-auto", isFetching && "opacity-60")}>
					<table className="w-full text-sm">
						<thead>
							<tr className="text-muted-foreground border-b text-left text-xs uppercase tracking-wide">
								<th className="py-2 pr-4 font-medium">Date</th>
								<th className="py-2 pr-4 font-medium">Type</th>
								<th className="py-2 pr-4 font-medium">Details</th>
								<th className="py-2 pr-4 font-medium">Status</th>
								<th className="py-2 text-right font-medium">Amount</th>
							</tr>
						</thead>
						<tbody>
							{wallet.transactions.map((tx) => (
								<tr key={tx._id} className="border-b last:border-0">
									<td className="text-muted-foreground whitespace-nowrap py-3 pr-4">
										{new Date(tx.createdAt).toLocaleString("en-NG", {
											dateStyle: "medium",
											timeStyle: "short",
										})}
									</td>
									<td className="whitespace-nowrap py-3 pr-4">
										{CATEGORY_LABELS[tx.category] ?? tx.category}
									</td>
									<td className="py-3 pr-4">
										<span className="text-foreground">
											{tx.description ?? "—"}
										</span>
										{tx.orderId?.orderId && (
											<span className="text-muted-foreground block text-xs">
												Order {tx.orderId.orderId}
											</span>
										)}
										{tx.reference && (
											<span className="text-muted-foreground block text-xs">
												Ref {tx.reference}
											</span>
										)}
									</td>
									<td className="py-3 pr-4">
										<Badge
											className={cn(
												"rounded-full border-none capitalize shadow-none",
												STATUS_STYLES[tx.status],
											)}
										>
											{tx.status}
										</Badge>
									</td>
									<td
										className={cn(
											"whitespace-nowrap py-3 text-right font-semibold tabular-nums",
											tx.type === "credit"
												? "text-green-700"
												: "text-foreground",
										)}
									>
										{signedAmount(tx)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-xs">
						Page {pagination.page} of {pagination.totalPages} · {pagination.total}{" "}
						records
					</span>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1 || isFetching}
							onClick={() => setPage((p) => p - 1)}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={!pagination.hasNextPage || isFetching}
							onClick={() => setPage((p) => p + 1)}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
