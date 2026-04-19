import { Icon } from "@iconify/react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useDashboardOverview } from "@/hooks/analytics";
import { Skeleton } from "@/components/ui/skeleton";

export default function TotalOrders() {
	const { data, isLoading } = useDashboardOverview();
	const stats = data?.data?.orders;

	return (
		<div className="border-border/50 flex h-full flex-col justify-between rounded-[20px] border bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between">
				<div className="border-secondary/20 flex size-12 items-center justify-center rounded-full border-2">
					<Icon icon="ph:shopping-bag-fill" className="text-secondary" width="24" />
				</div>
				<div className="bg-secondary rounded-full px-3 py-1 text-[10px] font-bold text-white">
					Total Orders
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
					<span
						className={`${stats && stats.comparison < 0 ? "text-destructive" : "text-secondary"} flex items-center gap-1 text-xs font-medium`}
					>
						{isLoading ? (
							<Skeleton className="h-4 w-20" />
						) : (
							<>
								{stats && stats.comparison >= 0 ? `+${stats.comparison}%` : `${stats?.comparison}%`}{" "}
								<span className="text-muted-foreground font-normal">to last month</span>
							</>
						)}
					</span>
					<Link
						href={ROUTES.ORDERS}
						className="hover:bg-muted/50 cursor-pointer rounded-full p-1 transition-colors"
					>
						<Icon icon="ph:dots-three-vertical-bold" className="text-muted-foreground" />
					</Link>
				</div>
			</div>
		</div>
	);
}
