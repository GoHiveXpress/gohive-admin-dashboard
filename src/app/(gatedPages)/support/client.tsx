// src/app/(gatedPages)/support/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import SupportManagement from "@/components/Support/SupportManagement";

export default function SupportClient() {
	return (
		<RouteWrapper
			middleSlot={
				<div className="space-y-1">
					<h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-[30px]">
						Support And Communication
					</h1>
					<p className="text-muted-foreground text-sm sm:text-base">
						Manage conversations, tickets, broadcasts, and campaigns in one place.
					</p>
				</div>
			}
		>
			<SupportManagement />
		</RouteWrapper>
	);
}
