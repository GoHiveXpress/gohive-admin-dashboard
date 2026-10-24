// src/components/List/ActiveUserList/index.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { DataTable } from "@/components/Tables";
import TablePagination from "@/components/Tables/Pagination";
import {
	activeUsersColumnConfig,
	type ActiveUserData,
} from "@/components/Tables/columns/ActiveUsersColumnsConfig";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { ROUTES } from "@/constants/routes";
import { useRiders } from "@/hooks/riderManagement";
import { useVendors } from "@/hooks/vendorManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { type RiderListFilters } from "@/types/riderManagement";
import { type VendorListFilters } from "@/types/vendorManagement";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 20;

const TAB_ITEMS: TabItem[] = [
	{ id: "riders", label: "Online Riders" },
	{ id: "vendors", label: "Online Vendor" },
];

export default function ActiveUserList() {
	const [activeTab, setActiveTab] = useState<"riders" | "vendors">("riders");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [locationFilter, setLocationFilter] = useState("");
	const [ratingFilter, setRatingFilter] = useState("all");
	const [page, setPage] = useState(1);
	const debouncedSearch = useDebounce(searchQuery.trim(), 400);
	const debouncedLocation = useDebounce(locationFilter.trim(), 400);

	// Any filter or tab change starts again from the first page
	useEffect(() => {
		setPage(1);
	}, [activeTab, debouncedSearch, debouncedLocation, statusFilter, ratingFilter]);

	// Every filter runs on the server, one page at a time, for the open tab only
	const sharedFilters = {
		search: debouncedSearch || undefined,
		location: debouncedLocation || undefined,
		minRating: ratingFilter === "all" ? undefined : (ratingFilter as "2" | "3" | "4"),
		page,
		limit: PAGE_SIZE,
	};
	const {
		data: ridersResponse,
		isLoading: isLoadingRiders,
		isError: isRidersError,
		isFetching: isFetchingRiders,
	} = useRiders(
		{
			...sharedFilters,
			availability:
				statusFilter === "all"
					? undefined
					: (statusFilter as RiderListFilters["availability"]),
		},
		{ enabled: activeTab === "riders", keepPrevious: true },
	);
	const {
		data: vendorsResponse,
		isLoading: isLoadingVendors,
		isError: isVendorsError,
		isFetching: isFetchingVendors,
	} = useVendors(
		{
			...sharedFilters,
			availability:
				statusFilter === "all"
					? undefined
					: (statusFilter as VendorListFilters["availability"]),
		},
		{ enabled: activeTab === "vendors", keepPrevious: true },
	);

	const ridersData = useMemo<ActiveUserData[]>(() => {
		const riders = ridersResponse?.data ?? [];
		return riders.map((rider) => {
			const availability = rider.riderProfile?.availabilityStatus;
			const isOnline = availability === "online" || availability === "busy";
			const location = (rider as { location?: { address?: string } }).location?.address;
			// Ratings live on the profile (riderProfile.averageRating)
			const rating =
				(rider as { riderProfile?: { averageRating?: number } }).riderProfile
					?.averageRating ?? 0;

			return {
				id: rider._id,
				name: rider.name,
				userType: "Rider",
				userId: `RGHV${rider._id.slice(-4).toUpperCase()}`,
				image: rider.profilePicture ?? "",
				location: location ?? "N/A",
				phone: rider.phone || "N/A",
				status: isOnline ? "Active" : "Offline",
				activeOrder: availability === "busy" ? "Yes" : "No",
				rating,
			};
		});
	}, [ridersResponse]);

	const vendorsData = useMemo<ActiveUserData[]>(() => {
		const vendors = vendorsResponse?.data ?? [];
		return vendors.map((vendor) => {
			const isOnline = vendor.vendorProfile?.availabilityStatus === "online";
			// Ratings live on the profile (vendorProfile.averageRating)
			const rating =
				(vendor as { vendorProfile?: { averageRating?: number } }).vendorProfile
					?.averageRating ?? 0;

			return {
				id: vendor._id,
				name: vendor.vendorProfile?.businessName || vendor.name,
				userType: "Vendor",
				userId: `VGHV${vendor._id.slice(-4).toUpperCase()}`,
				image: vendor.profilePicture ?? "",
				location: vendor.vendorProfile?.businessAddress || "N/A",
				phone: vendor.phone || "N/A",
				status: isOnline ? "Online" : "Offline",
				activeOrder:
					(vendor as { activeOrdersCount?: number }).activeOrdersCount ??
					(isOnline ? "Yes" : "No"),
				rating,
			};
		});
	}, [vendorsResponse]);

	const currentData = activeTab === "riders" ? ridersData : vendorsData;
	const pagination =
		activeTab === "riders" ? ridersResponse?.pagination : vendorsResponse?.pagination;
	const isFetching = activeTab === "riders" ? isFetchingRiders : isFetchingVendors;

	const isLoading = activeTab === "riders" ? isLoadingRiders : isLoadingVendors;
	const isError = activeTab === "riders" ? isRidersError : isVendorsError;

	// Dynamic Page Title Logic
	const pageTitle = activeTab === "riders" ? "Active Rider" : "Active Vendor";

	const columns = getColumns(activeUsersColumnConfig);

	let tableBody = (
		<div className={isFetching ? "opacity-60 transition-opacity" : undefined}>
			<DataTable columns={columns} data={currentData} title="" />
			<TablePagination
				pagination={pagination}
				onPageChange={setPage}
				isFetching={isFetching}
				itemLabel={activeTab}
			/>
		</div>
	);
	if (isLoading) {
		tableBody = (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	} else if (isError) {
		tableBody = (
			<div className="text-destructive flex h-64 items-center justify-center">
				Failed to load users.
			</div>
		);
	}

	return (
		<div className="w-full space-y-6">
			{/* Header / Title Section */}
			<div className="flex items-center justify-between">
				<h1 className="text-foreground text-2xl font-bold transition-all duration-300 ease-in-out">
					{pageTitle}
				</h1>

				{/* Back Button with Centralized Routing */}
				<Link href={ROUTES.DASHBOARD}>
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-muted border-border rounded-full border bg-white shadow-sm"
					>
						<Icon icon="ph:arrow-u-up-left-bold" width="20" />
					</Button>
				</Link>
			</div>

			{/* Tabs & Filters Container */}
			<div className="border-border/50 space-y-6 rounded-[20px] border bg-white p-6 shadow-sm">
				{/* Tabs */}
				<div className="bg-muted/30 w-fit rounded-full p-1.5">
					<CustomTabs
						items={TAB_ITEMS}
						activeTab={activeTab as string}
						onTabChange={(tab) => {
							setActiveTab(tab as "riders" | "vendors");
							// The status values differ between the tabs
							setStatusFilter("all");
						}}
					/>
				</div>

				{/* Filters Row */}
				<div className="flex flex-wrap gap-3">
					<div className="relative w-full sm:w-[280px]">
						<Icon
							icon="ph:magnifying-glass"
							className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
						/>
						<Input
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by name, email or phone"
							className="border-border h-10 rounded-lg bg-white pl-10"
						/>
					</div>

					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="border-border h-10 w-[140px] rounded-lg bg-white text-sm font-medium">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							{activeTab === "riders" ? (
								<>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="busy">On a delivery</SelectItem>
									<SelectItem value="offline">Offline</SelectItem>
								</>
							) : (
								<>
									<SelectItem value="online">Online</SelectItem>
									<SelectItem value="offline">Offline</SelectItem>
								</>
							)}
						</SelectContent>
					</Select>

					<Input
						value={locationFilter}
						onChange={(e) => setLocationFilter(e.target.value)}
						placeholder="Location"
						className="border-border h-10 w-[170px] rounded-lg bg-white text-sm"
					/>

					<Select value={ratingFilter} onValueChange={setRatingFilter}>
						<SelectTrigger className="border-border h-10 w-[140px] rounded-lg bg-white text-sm font-medium">
							<SelectValue placeholder="Rating" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Ratings</SelectItem>
							<SelectItem value="4">4.0 and up</SelectItem>
							<SelectItem value="3">3.0 and up</SelectItem>
							<SelectItem value="2">2.0 and up</SelectItem>
						</SelectContent>
					</Select>

					<Button
						variant="outline"
						onClick={() => {
							setSearchQuery("");
							setStatusFilter("all");
							setLocationFilter("");
							setRatingFilter("all");
						}}
						className="border-border h-10 rounded-lg bg-white px-4 text-sm font-medium"
					>
						Reset
					</Button>
				</div>

				{/* Table */}
				{tableBody}
			</div>
		</div>
	);
}
