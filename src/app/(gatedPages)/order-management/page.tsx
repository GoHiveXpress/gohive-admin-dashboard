// src/app/(gatedPages)/order-management/page.tsx
import { type Metadata } from "next";
import { Suspense } from "react";
import OrderManagementClient from "./client";

export const metadata: Metadata = { title: "Orders" };

// The page reads its filters from the URL, which needs a Suspense boundary.
export default function OrderManagementPage() {
	return (
		<Suspense fallback={null}>
			<OrderManagementClient />
		</Suspense>
	);
}
