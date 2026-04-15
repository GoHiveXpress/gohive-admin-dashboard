"use client";

import OrderHistoryList from "@/components/List/OrderHistoryList";

export default function CustomerOrderTab({ id }: { id: string }) {
    return (
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50">
           <OrderHistoryList customerId={id} />
        </div>
    );
}