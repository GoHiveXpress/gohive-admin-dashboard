// src/components/List/ActiveUserList/index.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { DataTable } from "@/components/Tables";
import {
	activeUsersColumnConfig,
	type ActiveUserData,
} from "@/components/Tables/columns/ActiveUsersColumnsConfig";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { ROUTES } from "@/constants/routes";
import { useRiders, useVendors } from "@/hooks/userManagement";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const TAB_ITEMS: TabItem[] = [
	{ id: "riders", label: "Online Riders" },
	{ id: "vendors", label: "Online Vendor" },
];

export default function ActiveUserList() {
	const [activeTab, setActiveTab] = useState<"riders" | "vendors">("riders");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [locationFilter, setLocationFilter] = useState("all");
	const [ratingFilter, setRatingFilter] = useState("all");

	const {
		data: ridersResponse,
		isLoading: isLoadingRiders,
		isError: isRidersError,
	} = useRiders();
	const {
		data: vendorsResponse,
		isLoading: isLoadingVendors,
		isError: isVendorsError,
	} = useVendors();

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
				image: rider.profilePicture || "",
				location: location || "N/A",
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
				image: vendor.profilePicture || "",
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

	const baseData = activeTab === "riders" ? ridersData : vendorsData;

	const locationOptions = useMemo(() => {
		const uniqueLocations = Array.from(
			new Set(baseData.map((item) => item.location).filter((location) => location !== "N/A")),
		);
		return uniqueLocations.sort((a, b) => a.localeCompare(b));
	}, [baseData]);

	const currentData = useMemo(() => {
		return baseData.filter((item) => {
			const query = searchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				item.name.toLowerCase().includes(query) ||
				item.userId.toLowerCase().includes(query) ||
				item.phone.toLowerCase().includes(query);

			const matchesStatus =
				statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();

			const matchesLocation = locationFilter === "all" || item.location === locationFilter;

			const matchesRating =
				ratingFilter === "all" ||
				(ratingFilter === "4" && item.rating >= 4) ||
				(ratingFilter === "3" && item.rating >= 3) ||
				(ratingFilter === "2" && item.rating >= 2);

			return matchesSearch && matchesStatus && matchesLocation && matchesRating;
		});
	}, [baseData, locationFilter, ratingFilter, searchQuery, statusFilter]);

	const isLoading = activeTab === "riders" ? isLoadingRiders : isLoadingVendors;
	const isError = activeTab === "riders" ? isRidersError : isVendorsError;

	// Dynamic Page Title Logic
	const pageTitle = activeTab === "riders" ? "Active Rider" : "Active Vendor";

	const columns = getColumns(activeUsersColumnConfig);

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
						onTabChange={(tab) => setActiveTab(tab as "riders" | "vendors")}
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
							placeholder="Search by name, ID or phone"
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

					<Select value={locationFilter} onValueChange={setLocationFilter}>
						<SelectTrigger className="border-border h-10 w-[170px] rounded-lg bg-white text-sm font-medium">
							<SelectValue placeholder="Location" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Locations</SelectItem>
							{locationOptions.map((location) => (
								<SelectItem key={location} value={location}>
									{location}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

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
							setLocationFilter("all");
							setRatingFilter("all");
						}}
						className="border-border h-10 rounded-lg bg-white px-4 text-sm font-medium"
					>
						Reset
					</Button>
				</div>

				{/* Table */}
				{isLoading ? (
					<div className="flex h-64 items-center justify-center">
						<Loader2 className="text-secondary size-8 animate-spin" />
					</div>
				) : isError ? (
					<div className="text-destructive flex h-64 items-center justify-center">
						Failed to load users.
					</div>
				) : (
					<DataTable columns={columns} data={currentData} title="" />
				)}
			</div>
		</div>
	);
}
