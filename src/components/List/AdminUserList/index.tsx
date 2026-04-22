"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { adminUserColumns, type AdminUserData } from "@/components/Tables/columns/AdminUserColumns";
import { useAdmins } from "@/hooks/userManagement";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminUserList() {
	const { data: response, isLoading } = useAdmins();
	const admins = response?.data || [];

	const tableData: AdminUserData[] = admins.map((a) => ({
		id: a._id,
		name: a.name,
		adminId: a._id.slice(-8).toUpperCase(),
		role: a.role === "superadmin" ? "Super Admin" : "Staff",
		date: format(new Date(a.createdAt), "dd MMM yyyy | hh:mm a"),
		status: a.accountStatus === "Suspend" ? "Inactive" : "Active" as any,
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
			<DataTable columns={getColumns(adminUserColumns)} data={tableData} />
		</div>
	);
}
