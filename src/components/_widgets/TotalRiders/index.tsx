// src/components/_widgets/TotalRiders/index.tsx

"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { ROUTES, getRoute } from "@/constants/routes";

export default function TotalRiders() {
	return (
		<div className="border-border/50 flex h-full flex-col justify-between rounded-[20px] border bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between">
				<div className="border-primary/20 flex size-12 items-center justify-center rounded-full border-2">
					<Icon icon="ph:moped-fill" className="text-primary" width="24" />
				</div>
				<div className="bg-primary text-foreground rounded-full px-3 py-1 text-[10px] font-bold">
					Total Riders
				</div>
			</div>
			<div>
				<h2 className="text-foreground mb-1 mt-4 text-3xl font-bold">547</h2>
				<div className="flex items-center justify-between">
					<span className="text-secondary flex items-center gap-1 text-xs font-medium">
						450 <span className="text-muted-foreground font-normal">Online</span>
					</span>

					{/* LINK WRAPPER START */}
					<Link
						href={getRoute(ROUTES.ACTIVE_USERS, { tab: "riders" })}
						className="hover:bg-muted/50 cursor-pointer rounded-full p-1 transition-colors"
					>
						<Icon
							icon="ph:dots-three-vertical-bold"
							className="text-muted-foreground"
							width="20"
						/>
					</Link>
					{/* LINK WRAPPER END */}
				</div>
			</div>
		</div>
	);
}
