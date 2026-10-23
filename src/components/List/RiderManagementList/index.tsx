// src/components/List/RiderManagementList/index.tsx
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { riderColumnsConfig } from "@/components/Tables/columns/RiderManagementColumns";
import { useRiders } from "@/hooks/riderManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { type RiderListFilters, type RiderUser } from "@/types/riderManagement";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function RiderManagementList() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [kycFilter, setKycFilter] = useState("all");
	const debouncedSearch = useDebounce(searchQuery.trim(), 400);

	// Search, availability and KYC are filtered by the server.
	const {
		data: response,
		isLoading,
		isError,
		isFetching,
	} = useRiders(
		{
			search: debouncedSearch || undefined,
			availability:
				statusFilter === "all"
					? undefined
					: (statusFilter as RiderListFilters["availability"]),
			kyc: kycFilter === "all" ? undefined : (kycFilter as RiderListFilters["kyc"]),
		},
		{ keepPrevious: true },
	);
	const riders = response?.data || [];

	// Map API data to the format the table expects.
	// Riders who never finished onboarding have no riderProfile, and some
	// accounts have no name or email, so every field is read defensively.
	const formattedData = riders.map((rider: RiderUser) => ({
		id: rider._id,
		name: rider.name ?? "Unnamed rider",
		email: rider.email ?? "",
		phone: rider.phone || "N/A",
		status: capitalize(rider.riderProfile?.availabilityStatus ?? "offline"),
		kyc:
			rider.riderProfile?.verificationStatus === "approved"
				? "Verified"
				: capitalize(rider.riderProfile?.verificationStatus ?? "pending"),
		rating: rider.riderProfile?.averageRating ?? 0,
		profilePicture: rider.profilePicture || "",
		// Pass the full object if needed for actions
		original: rider,
	}));

	const handleResetFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
		setKycFilter("all");
	};

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return <div className="text-red-500">Failed to load riders.</div>;
	}

	return (
		<div className="space-y-6">
			{/* Filters Row */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Search Bar */}
				<div className="relative w-full sm:w-[300px]">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search by name, email or phone"
						className="border-border h-12 rounded-lg bg-white pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<Button
					variant={statusFilter === "all" && kycFilter === "all" ? "default" : "outline"}
					onClick={handleResetFilters}
					className={`h-12 rounded-lg px-6 font-medium ${statusFilter === "all" && kycFilter === "all" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border bg-white"}`}
				>
					All
				</Button>

				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="border-border h-12 w-[160px] rounded-lg bg-white font-medium">
						<SelectValue placeholder="Availability" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="online">Online</SelectItem>
						<SelectItem value="busy">Busy</SelectItem>
						<SelectItem value="offline">Offline</SelectItem>
					</SelectContent>
				</Select>

				<Select value={kycFilter} onValueChange={setKycFilter}>
					<SelectTrigger className="border-border h-12 w-[160px] rounded-lg bg-white font-medium">
						<SelectValue placeholder="KYC Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All KYC</SelectItem>
						<SelectItem value="approved">Verified</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="rejected">Rejected</SelectItem>
					</SelectContent>
				</Select>

				<Select disabled>
					<SelectTrigger className="border-border h-12 min-w-[140px] rounded-lg bg-white font-medium">
						<SelectValue placeholder="Performance Rating" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Ratings</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<div className={isFetching ? "opacity-60 transition-opacity" : undefined}>
				<DataTable columns={getColumns(riderColumnsConfig)} data={formattedData} title="" />
			</div>
		</div>
	);
}

/* eslint-enable */
