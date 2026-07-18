// src/components/List/VendorList/index.tsx
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	vendorColumnsConfig,
	type VendorData,
} from "@/components/Tables/columns/VendorManagementColumns";
import { useVendors } from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function VendorList() {
	const { data, isLoading } = useVendors();
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
	const [kycFilter, setKycFilter] = useState<"all" | "Verified" | "Unverified">("all");
	const [sortMode, setSortMode] = useState<"asc" | "desc" | null>(null);

	// Map backend data to table format
	const vendorTableData: VendorData[] =
		data?.data?.map((vendor) => ({
			id: vendor._id,
			name: vendor.vendorProfile?.businessName || vendor.name, // Prefer Business Name
			email: vendor.email,
			phone: vendor.phone || "N/A",
			// Logic: Verified email = Active status for now (customize as needed)
			status: vendor.vendorProfile?.isApproved ? "Active" : "Inactive",
			// Logic: Approved profile = Verified KYC
			kyc: vendor.vendorProfile?.isApproved ? "Verified" : "Unverified",
			rating: 0.0, // Backend doesn't provide rating yet, defaulting to 0
		})) || [];

	const filteredData = useMemo(() => {
		let result = vendorTableData.filter((vendor) => {
			const query = searchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				vendor.name.toLowerCase().includes(query) ||
				vendor.email.toLowerCase().includes(query) ||
				vendor.phone.toLowerCase().includes(query);

			const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
			const matchesKyc = kycFilter === "all" || vendor.kyc === kycFilter;

			return matchesSearch && matchesStatus && matchesKyc;
		});

		if (sortMode === "asc") {
			result = [...result].sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortMode === "desc") {
			result = [...result].sort((a, b) => b.name.localeCompare(a.name));
		}

		return result;
	}, [kycFilter, searchQuery, sortMode, statusFilter, vendorTableData]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
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
						placeholder="Search"
						className="border-border h-12 rounded-lg bg-white pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<Button
					onClick={() => {
						setSearchQuery("");
						setStatusFilter("all");
						setKycFilter("all");
						setSortMode(null);
					}}
					className={cn(
						"h-12 rounded-lg px-6 font-medium",
						statusFilter === "all" && kycFilter === "all" && !searchQuery && !sortMode
							? "bg-primary text-primary-foreground hover:bg-primary/90"
							: "bg-muted text-foreground hover:bg-muted/80",
					)}
				>
					All
				</Button>

				<Button
					variant={sortMode !== null ? "default" : "outline"}
					onClick={() =>
						setSortMode((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"))
					}
					className={cn(
						"h-12 rounded-lg px-6 font-medium",
						sortMode !== null
							? "bg-[#123614] text-white hover:bg-[#123614]/90"
							: "border-border bg-white",
					)}
				>
					A-Z {sortMode === "asc" ? "↓" : sortMode === "desc" ? "↑" : ""}
				</Button>

				<Select
					value={statusFilter}
					onValueChange={(value) => setStatusFilter(value as "all" | "Active" | "Inactive")}
				>
					<SelectTrigger className="border-border h-12 w-[160px] rounded-lg bg-white font-medium">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="Active">Active</SelectItem>
						<SelectItem value="Inactive">Inactive</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={kycFilter}
					onValueChange={(value) => setKycFilter(value as "all" | "Verified" | "Unverified")}
				>
					<SelectTrigger className="border-border h-12 w-[180px] rounded-lg bg-white font-medium">
						<SelectValue placeholder="KYC" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All KYC</SelectItem>
						<SelectItem value="Verified">Verified</SelectItem>
						<SelectItem value="Unverified">Unverified</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<DataTable columns={getColumns(vendorColumnsConfig)} data={filteredData} title="" />
		</div>
	);
}

/* eslint-enable */
