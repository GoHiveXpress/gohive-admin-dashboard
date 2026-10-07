"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	vendorUserColumns,
	type VendorUserData,
} from "@/components/Tables/columns/VendorUserColumns";
import { useVendors } from "@/hooks/userManagement";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function VendorUserList() {
	const { data: response, isLoading } = useVendors();
	const vendors = response?.data || [];

	const tableData: VendorUserData[] = vendors.map((v) => ({
		id: v._id,
		storeName: v.vendorProfile.businessName || v.name,
		vendorId: v._id.slice(-8).toUpperCase(), // No separate vendor ID on the backend
		location: v.vendorProfile.businessAddress || "N/A",
		phone: v.phone,
		date: format(new Date(v.createdAt), "dd MMM yyyy | hh:mm a"),
		status: v.accountStatus === "Suspend" ? "Inactive" : ("Active" as any),
	}));

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="border-border/50 w-full rounded-[20px] border bg-white pt-6 shadow-sm">
			<DataTable columns={getColumns(vendorUserColumns)} data={tableData} />
		</div>
	);
}
