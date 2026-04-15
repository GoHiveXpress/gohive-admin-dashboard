// src/app/(gatedPages)/support/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import SupportManagement from "@/components/Support/SupportManagement";

export default function SupportClient() {
	return (
		<RouteWrapper
			middleSlot={
				<h1 className="text-foreground text-2xl font-semibold">
					Support And Communication
				</h1>
			}
		>
			<SupportManagement />
		</RouteWrapper>
	);
}
