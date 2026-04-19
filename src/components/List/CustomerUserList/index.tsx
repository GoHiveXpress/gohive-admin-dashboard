"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	customerUserColumns,
	type CustomerUserData,
} from "@/components/Tables/columns/CustomerUserColumns";
import { useCustomers } from "@/hooks/userManagement";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function CustomerUserList() {
	const { data: response, isLoading } = useCustomers();
	const customers = response?.data || [];

	const tableData: CustomerUserData[] = customers.map((c) => ({
		id: c._id,
		name: c.name,
		customerId: c._id.slice(-8).toUpperCase(),
		email: c.email,
		phone: c.phone,
		date: format(new Date(c.createdAt), "dd MMM yyyy | hh:mm a"),
		status: c.accountStatus === "Suspend" ? "Inactive" : "Active" as any, // Mapping status
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
			<DataTable columns={getColumns(customerUserColumns)} data={tableData} />
		</div>
	);
}
