"use client";

import OrderHistoryList from "@/components/List/OrderHistoryList";

export default function CustomerOrderTab({ id }: { id: string }) {
	return (
		<div className="border-border/50 rounded-[20px] border bg-white p-6 shadow-sm">
			<OrderHistoryList customerId={id} />
		</div>
	);
}
