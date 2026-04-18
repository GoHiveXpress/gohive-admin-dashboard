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
import { type RiderUser } from "@/types/riderManagement";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RiderManagementList() {
	const { data: response, isLoading, isError } = useRiders();
	const riders = response?.data || [];

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [kycFilter, setKycFilter] = useState("all");

	// Filter and Map API data to the format your Table expects
	const formattedData = riders
		.filter((rider: RiderUser) => {
			const matchesSearch =
				rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(rider.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
				(rider.phone || "").includes(searchQuery);

			const matchesStatus = statusFilter === "all" || rider.riderProfile.availabilityStatus === statusFilter;
			const matchesKyc = kycFilter === "all" || rider.riderProfile.verificationStatus === kycFilter;

			return matchesSearch && matchesStatus && matchesKyc;
		})
		.map((rider: RiderUser) => ({
			id: rider._id,
			name: rider.name,
			email: rider.email,
			phone: rider.phone || "N/A",
			// Capitalize first letter for UI consistency
			status: rider.riderProfile.availabilityStatus.charAt(0).toUpperCase() + rider.riderProfile.availabilityStatus.slice(1),
			kyc: rider.riderProfile.verificationStatus.charAt(0).toUpperCase() + rider.riderProfile.verificationStatus.slice(1),
			// Default rating to 0 or 5.0 as it's not in the current RiderUser type
			rating: 5.0,
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
					<Icon icon="ph:magnifying-glass" className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2" />
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
					className={`h-12 rounded-lg px-6 font-medium ${statusFilter === "all" && kycFilter === "all" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white border-border"}`}
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
						<SelectItem value="offline">Offline</SelectItem>
					</SelectContent>
				</Select>

				<Select value={kycFilter} onValueChange={setKycFilter}>
					<SelectTrigger className="border-border h-12 w-[160px] rounded-lg bg-white font-medium">
						<SelectValue placeholder="KYC Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All KYC</SelectItem>
						<SelectItem value="verified">Verified</SelectItem>
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
			<DataTable columns={getColumns(riderColumnsConfig)} data={formattedData} title="" />
		</div>
	);
}

/* eslint-enable */
