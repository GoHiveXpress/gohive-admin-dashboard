"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useVendorLeaderboard } from "@/hooks/analytics";
import { useVendorCategories } from "@/hooks/useVendorCategories";
import { Skeleton } from "@/components/ui/skeleton";
import TableExport from "@/components/_atoms/TableExport";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { VendorLeaderboardData } from "@/types/analytics";

interface VendorLeaderboardListProps {
	filters: any;
	onFilterChange: (key: string, value: string) => void;
}

export default function VendorLeaderboardList({
	filters,
	onFilterChange,
}: VendorLeaderboardListProps) {
	const { data: leaderboardResponse, isLoading } = useVendorLeaderboard(filters);
	const leaderboardData = (leaderboardResponse?.data as VendorLeaderboardData[]) || [];
	// Vendors pick their business type from these categories
	const { data: categoriesData } = useVendorCategories();
	const categories = categoriesData?.data ?? [];

	return (
		<div className="border-border mt-6 rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Icon icon="ph:trophy-fill" className="size-5 text-[#F58A20]" />
					<h3 className="text-xl font-medium">Vendor Leaderboard</h3>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Select
						value={filters.location || "all"}
						onValueChange={(val) =>
							onFilterChange("location", val === "all" ? "" : val)
						}
					>
						<SelectTrigger className="h-9 w-[120px] text-sm">
							<SelectValue placeholder="Region" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Regions</SelectItem>
							<SelectItem value="Lagos">Lagos</SelectItem>
							<SelectItem value="VI">Victoria Island</SelectItem>
							<SelectItem value="Lekki">Lekki</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={filters.category || "all"}
						onValueChange={(val) =>
							onFilterChange("category", val === "all" ? "" : val)
						}
					>
						<SelectTrigger className="h-9 w-[130px] text-sm">
							<SelectValue placeholder="Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category._id} value={category.value}>
									{category.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={filters.sort || "rating"}
						onValueChange={(val) => onFilterChange("sort", val)}
					>
						<SelectTrigger className="h-9 w-[110px] text-sm">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="rating">Top rated</SelectItem>
							<SelectItem value="orders">Most orders</SelectItem>
							<SelectItem value="revenue">Most revenue</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/30 border-none hover:bg-muted/30">
							<TableHead className="w-[80px] text-xs font-semibold uppercase">
								Rank
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Vendor Name
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Location
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Category
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Total Order
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Avg Rating
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Delivery Time
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Revenue
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">Trend</TableHead>
							<TableHead className="w-[50px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							[1, 2, 3].map((i) => (
								<TableRow key={i}>
									<TableCell colSpan={10}>
										<Skeleton className="h-12 w-full" />
									</TableCell>
								</TableRow>
							))
						) : leaderboardData.length > 0 ? (
							leaderboardData.map((vendor: VendorLeaderboardData) => (
								<TableRow
									key={vendor.id}
									className="border-border hover:bg-muted/50 border-b"
								>
									<TableCell className="font-medium">
										{vendor.rank === 1 ? (
											<span className="flex items-center gap-1.5">
												<Icon
													icon="ph:trophy-fill"
													className="size-4 text-[#F58A20]"
												/>
												{vendor.rank}
											</span>
										) : (
											vendor.rank
										)}
									</TableCell>
									<TableCell className="font-medium">
										{vendor.vendorName}
									</TableCell>
									<TableCell className="text-muted-foreground whitespace-nowrap">
										{vendor.location}
									</TableCell>
									<TableCell className="font-medium">{vendor.category}</TableCell>
									<TableCell>{vendor.totalOrders}</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Icon
												icon="ph:star-fill"
												className="size-4 text-[#FACC15]"
											/>
											{vendor.avgRating}
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{vendor.deliveryTime}
									</TableCell>
									<TableCell className="font-bold">{vendor.revenue}</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<span className="size-2 rounded-full bg-[#F58A20]" />
											<span className="text-xs font-medium text-[#F58A20]">
												{vendor.trend}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<Button
											asChild
											variant="ghost"
											size="icon"
											className="text-muted-foreground size-8"
										>
											<Link
												href={`/vendor-management/${vendor.id}`}
												aria-label="View profile"
											>
												<Icon
													icon="lucide:arrow-up-right"
													className="size-4"
												/>
											</Link>
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="mt-6 flex items-center justify-between">
				<div className="flex gap-3">
					<TableExport
						data={leaderboardData}
						filename="vendor-leaderboard"
						columns={[
							{ header: "Rank", key: "rank" },
							{ header: "Vendor Name", key: "vendorName" },
							{ header: "Location", key: "location" },
							{ header: "Category", key: "category" },
							{ header: "Total Orders", key: "totalOrders" },
							{ header: "Avg Rating", key: "avgRating" },
							{ header: "Revenue", key: "revenue" },
						]}
					/>
				</div>
			</div>
		</div>
	);
}
