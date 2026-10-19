// What the agent usually needs while answering: the user's recent orders, wallet
// balance and pending refunds, with links into the shared detail panel.

import React from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useDetailPanel } from "@/components/DetailPanel";
import { useChatContext } from "@/hooks/supportManagement";
import { type ISupportChat } from "@/types/supportManagement";

const naira = (amount: number) => `₦${amount.toLocaleString()}`;

export default function ChatContext({ chat }: { chat: ISupportChat }) {
	const { open } = useDetailPanel();
	const { data, isLoading, isError } = useChatContext(chat._id);
	const context = data?.data;
	const userId = chat.user._id;

	let body: React.ReactNode;
	if (isLoading) {
		body = (
			<div className="space-y-2">
				{[0, 1, 2].map((row) => (
					<Skeleton key={row} className="h-8 w-full" />
				))}
			</div>
		);
	} else if (isError || !context) {
		body = <p className="text-muted-foreground text-xs">Couldn&apos;t load account details.</p>;
	} else {
		body = (
			<>
				<div className="grid grid-cols-3 gap-2 text-center">
					<div className="bg-muted/50 rounded-lg p-2">
						<p className="text-sm font-bold">{context.orderCount}</p>
						<p className="text-muted-foreground text-[10px]">Orders</p>
					</div>
					<div className="bg-muted/50 rounded-lg p-2">
						<p className="truncate text-sm font-bold">
							{context.wallet ? naira(context.wallet.balance) : "—"}
						</p>
						<p className="text-muted-foreground text-[10px]">Wallet</p>
					</div>
					<div
						className={`rounded-lg p-2 ${context.pendingRefunds > 0 ? "bg-amber-100 text-amber-800" : "bg-muted/50"}`}
					>
						<p className="text-sm font-bold">{context.pendingRefunds}</p>
						<p className="text-[10px] opacity-70">Pending refunds</p>
					</div>
				</div>

				<div>
					<p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
						Recent orders
					</p>
					{context.orders.length === 0 ? (
						<p className="text-muted-foreground text-xs">No orders yet.</p>
					) : (
						<ul className="space-y-1">
							{context.orders.map((order) => (
								<li key={order._id}>
									<button
										type="button"
										onClick={() => open({ kind: "order", id: order._id })}
										className="hover:bg-muted flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs"
									>
										<span className="min-w-0">
											<span className="block font-medium">
												#{order.orderId}
											</span>
											<span className="text-muted-foreground capitalize">
												{order.status.replace(/_/g, " ")} ·{" "}
												{format(new Date(order.createdAt), "MMM d")}
											</span>
										</span>
										<span className="shrink-0 font-medium">
											{naira(order.totalAmount)}
										</span>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</>
		);
	}

	return (
		<div className="border-border flex flex-col gap-4 border-t pt-5">
			{body}
			{userId && (
				<button
					type="button"
					onClick={() => open({ kind: chat.role, id: userId })}
					className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
				>
					<Icon icon="lucide:panel-right-open" className="size-4" />
					Open {chat.role} details
				</button>
			)}
		</div>
	);
}
