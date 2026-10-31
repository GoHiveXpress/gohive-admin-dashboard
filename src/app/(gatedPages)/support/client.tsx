// src/app/(gatedPages)/support/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import SupportManagement from "@/components/Support/SupportManagement";

export default function SupportClient() {
	return (
		<RouteWrapper
			middleSlot={
				<p className="text-muted-foreground text-sm sm:text-base">
					Manage conversations, tickets, broadcasts, and campaigns in one place.
				</p>
			}
		>
			<SupportManagement />
		</RouteWrapper>
	);
}
