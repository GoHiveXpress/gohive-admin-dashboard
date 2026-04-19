"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRiderLeaderboard } from "@/hooks/analytics";
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
import { RiderLeaderboardData } from "@/types/analytics";

interface RiderLeaderboardListProps {
	filters: any;
	onFilterChange: (key: string, value: string) => void;
}

export default function RiderLeaderboardList({ filters, onFilterChange }: RiderLeaderboardListProps) {
	const { data: leaderboardResponse, isLoading } = useRiderLeaderboard(filters);
	const leaderboardData = (leaderboardResponse?.data as RiderLeaderboardData[]) || [];

	return (
		<div className="border-border mt-6 rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Icon icon="ph:bicycle-fill" className="text-secondary size-5" />
					<h3 className="text-xl font-medium">Rider Leaderboard</h3>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Button variant="outline" size="icon" className="size-9">
						<Icon icon="lucide:sliders-horizontal" className="size-4" />
					</Button>
					<Button className="bg-secondary h-9 rounded-lg px-4 text-xs text-white">
						All
					</Button>

					<Select value={filters.location || "all"} onValueChange={(val) => onFilterChange("location", val === "all" ? "" : val)}>
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

					<Select value={filters.range} onValueChange={(val) => onFilterChange("range", val)}>
						<SelectTrigger className="h-9 w-[120px] text-sm">
							<SelectValue placeholder="Timeframe" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="weekly">Weekly</SelectItem>
							<SelectItem value="monthly">Monthly</SelectItem>
						</SelectContent>
					</Select>

					<Select value={filters.category || "all"} onValueChange={(val) => onFilterChange("category", val === "all" ? "" : val)}>
						<SelectTrigger className="h-9 w-[130px] text-sm">
							<SelectValue placeholder="Vehicle Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Vehicles</SelectItem>
							<SelectItem value="bike">Bike</SelectItem>
							<SelectItem value="car">Car</SelectItem>
							<SelectItem value="van">Van</SelectItem>
						</SelectContent>
					</Select>

					<Select value={filters.rating} onValueChange={(val) => onFilterChange("rating", val)}>
						<SelectTrigger className="h-9 w-[150px] text-sm">
							<SelectValue placeholder="Rating Threshold" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="4.5">Above 4.5</SelectItem>
							<SelectItem value="4.0">Above 4.0</SelectItem>
							<SelectItem value="3.5">Above 3.5</SelectItem>
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
								Rider Name
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Location
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Composite Score
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Trip Count
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Avg Rating
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Est. Delivery Time
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Total Earnings
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase">
								Trend
							</TableHead>
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
							leaderboardData.map((rider: RiderLeaderboardData) => (
								<TableRow key={rider.id || rider.riderId} className="border-border hover:bg-muted/50 border-b">
									<TableCell className="font-medium">
										{rider.rank === 1 ? (
											<span className="flex items-center gap-1.5">
												<Icon
													icon="ph:trophy-fill"
													className="size-4 text-[#F58A20]"
												/>
												{rider.rank}
											</span>
										) : (
											rider.rank
										)}
									</TableCell>
									<TableCell className="font-medium">
										{rider.riderName}
										<div className="text-muted-foreground text-[10px]">
											ID: {rider.riderId}
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground whitespace-nowrap">
										{rider.location}
									</TableCell>
									<TableCell className="font-bold">
										{rider.compositeScore}%
									</TableCell>
									<TableCell className="font-medium">
										{rider.tripCount}
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Icon
												icon="ph:star-fill"
												className="size-4 text-[#FACC15]"
											/>
											{rider.avgRating}
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{rider.estDeliveryTime}
									</TableCell>
									<TableCell className="font-bold">
										{rider.totalEarnings}
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<span className="size-2 rounded-full bg-[#22C55E]" />
											<span className="text-xs font-medium text-[#22C55E]">
												{rider.trend}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<Button
											variant="ghost"
											size="icon"
											className="text-muted-foreground size-8"
										>
											<Icon icon="lucide:more-vertical" className="size-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} className="h-24 text-center">
									No results found. Try adjusting your filters.
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
						filename="rider-leaderboard" 
						columns={[
							{ header: "Rank", key: "rank" },
							{ header: "Rider Name", key: "riderName" },
							{ header: "ID", key: "riderId" },
							{ header: "Location", key: "location" },
							{ header: "Composite Score", key: "compositeScore" },
							{ header: "Trip Count", key: "tripCount" },
							{ header: "Avg Rating", key: "avgRating" },
							{ header: "Total Earnings", key: "totalEarnings" },
						]}
					/>
					<Button className="bg-secondary h-10 gap-2 rounded-lg px-6 text-white hover:bg-secondary/90">
						<Icon icon="ph:share-network-bold" className="size-4" />
						Share Report
					</Button>
				</div>
				<div className="flex gap-4">
					<Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-lg px-6">
						Reward/Incentive
					</Button>
					<Button variant="destructive" className="h-10 gap-2 rounded-lg px-6">
						<Icon icon="ph:flag-bold" className="size-4" />
						Underperformer Flagging
					</Button>
				</div>
			</div>
		</div>
	);
}
