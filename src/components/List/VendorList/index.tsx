// src/components/List/VendorList/index.tsx
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import TablePagination from "@/components/Tables/Pagination";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	vendorColumnsConfig,
	type VendorData,
} from "@/components/Tables/columns/VendorManagementColumns";
import { useVendors } from "@/hooks/vendorManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { type VendorListFilters, type VendorProfile } from "@/types/vendorManagement";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Account status and KYC are separate things: a suspended vendor can still be
// KYC-verified, and an active one can be waiting on review.
const accountStatusLabel = (status?: string): VendorData["status"] => {
	if (status === "Active") return "Active";
	if (status === "Suspend") return "Suspended";
	return "Inactive";
};

const kycLabel = (profile?: VendorProfile): VendorData["kyc"] => {
	if (profile?.verificationStatus === "approved" || profile?.isApproved) return "Verified";
	if (profile?.verificationStatus === "rejected") return "Rejected";
	return "Pending";
};

// UI labels -> the values the backend filters on
const STATUS_PARAM: Record<VendorData["status"], VendorListFilters["status"]> = {
	Active: "Active",
	Inactive: "Inactive",
	Suspended: "Suspend",
};
const KYC_PARAM: Record<VendorData["kyc"], VendorListFilters["kyc"]> = {
	Verified: "approved",
	Pending: "pending",
	Rejected: "rejected",
};

const PAGE_SIZE = 20;

const NEXT_SORT = { none: "asc", asc: "desc", desc: null } as const;
const SORT_ARROW = { none: "", asc: "↓", desc: "↑" } as const;

export default function VendorList() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | VendorData["status"]>("all");
	const [kycFilter, setKycFilter] = useState<"all" | VendorData["kyc"]>("all");
	const [sortMode, setSortMode] = useState<"asc" | "desc" | null>(null);
	const [page, setPage] = useState(1);
	const debouncedSearch = useDebounce(searchQuery.trim(), 400);

	// Any filter change starts again from the first page
	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, statusFilter, kycFilter, sortMode]);

	// Filtering, A-Z sorting and paging all happen on the server
	const { data, isLoading, isFetching } = useVendors(
		{
			search: debouncedSearch || undefined,
			status: statusFilter === "all" ? undefined : STATUS_PARAM[statusFilter],
			kyc: kycFilter === "all" ? undefined : KYC_PARAM[kycFilter],
			sort: sortMode ? (`name_${sortMode}` as const) : undefined,
			page,
			limit: PAGE_SIZE,
		},
		{ keepPrevious: true },
	);

	// Map backend data to table format
	const vendorTableData: VendorData[] = useMemo(
		() =>
			data?.data?.map((vendor) => ({
				id: vendor._id,
				name: vendor.vendorProfile?.businessName || vendor.name || "Unnamed vendor",
				email: vendor.email || "",
				phone: vendor.phone || "N/A",
				status: accountStatusLabel(vendor.accountStatus),
				kyc: kycLabel(vendor.vendorProfile),
				rating: vendor.vendorProfile?.averageRating ?? 0,
			})) || [],
		[data],
	);

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
					onClick={() => setSortMode((prev) => NEXT_SORT[prev ?? "none"])}
					className={cn(
						"h-12 rounded-lg px-6 font-medium",
						sortMode !== null
							? "bg-[#123614] text-white hover:bg-[#123614]/90"
							: "border-border bg-white",
					)}
				>
					A-Z {SORT_ARROW[sortMode ?? "none"]}
				</Button>

				<Select
					value={statusFilter}
					onValueChange={(value) =>
						setStatusFilter(value as "all" | VendorData["status"])
					}
				>
					<SelectTrigger className="border-border h-12 w-[160px] rounded-lg bg-white font-medium">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="Active">Active</SelectItem>
						<SelectItem value="Inactive">Inactive</SelectItem>
						<SelectItem value="Suspended">Suspended</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={kycFilter}
					onValueChange={(value) => setKycFilter(value as "all" | VendorData["kyc"])}
				>
					<SelectTrigger className="border-border h-12 w-[180px] rounded-lg bg-white font-medium">
						<SelectValue placeholder="KYC" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All KYC</SelectItem>
						<SelectItem value="Verified">Verified</SelectItem>
						<SelectItem value="Pending">Pending</SelectItem>
						<SelectItem value="Rejected">Rejected</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<div className={cn(isFetching && "opacity-60 transition-opacity")}>
				<DataTable
					columns={getColumns(vendorColumnsConfig)}
					data={vendorTableData}
					title=""
				/>
				<TablePagination
					pagination={data?.pagination}
					onPageChange={setPage}
					isFetching={isFetching}
					itemLabel="vendors"
				/>
			</div>
		</div>
	);
}

/* eslint-enable */
