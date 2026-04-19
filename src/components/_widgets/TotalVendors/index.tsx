"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { ROUTES, getRoute } from "@/constants/routes";
import { useDashboardOverview } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";

export default function TotalVendors() {
	const { data, isLoading } = useDashboardOverview();
	const stats = data?.data?.vendors;

	return (
		<div className="border-border/50 flex h-full flex-col justify-between rounded-[20px] border bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between">
				<div className="border-destructive/20 flex size-12 items-center justify-center rounded-full border-2">
					<Icon icon="ph:storefront-fill" className="text-destructive" width="24" />
				</div>
				<div className="bg-destructive rounded-full px-3 py-1 text-[10px] font-bold text-white">
					Total Vendors
				</div>
			</div>
			<div>
				{isLoading ? (
					<Skeleton className="mb-1 mt-4 h-9 w-24" />
				) : (
					<h2 className="text-foreground mb-1 mt-4 text-3xl font-bold">
						{stats?.total.toLocaleString() ?? "0"}
					</h2>
				)}
				<div className="flex items-center justify-between">
					<span className="text-secondary flex items-center gap-1 text-xs font-medium">
						{isLoading ? (
							<Skeleton className="h-4 w-20" />
						) : (
							<>
								{stats?.online ?? "0"}{" "}
								<span className="text-muted-foreground font-normal">Online</span>
							</>
						)}
					</span>

					{/* LINK WRAPPER START */}
					<Link
						href={ROUTES.VENDORS}
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
