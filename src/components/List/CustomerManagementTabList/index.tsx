"use client";

/* eslint-disable no-nested-ternary */

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { customerColumnsConfig } from "@/components/Tables/columns/CustomerColumns";
import { useCustomers } from "@/hooks/customerManagement";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomerManagementTabList() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");

	const { data: customerResponse, isLoading, error } = useCustomers({ search, status });
	const customers = customerResponse?.data ?? [];

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative w-full sm:w-[250px]">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search"
						className="border-border h-10 rounded-lg bg-white pl-10"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<Button variant="outline" className="border-border size-10 rounded-lg bg-white p-0">
					<Icon icon="ph:sliders-horizontal" width="20" />
				</Button>
				<Button
					variant={status === "all" ? "secondary" : "outline"}
					className={`h-10 rounded-lg px-6 font-medium ${status === "all" ? "bg-[#FDB900] text-white hover:bg-[#e5a800]" : "border-border bg-white"}`}
					onClick={() => setStatus("all")}
				>
					All
				</Button>
				<Button
					variant="outline"
					className="border-border h-10 rounded-lg bg-white px-4 font-medium"
				>
					A-Z
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="border-border h-10 min-w-[100px] justify-between rounded-lg bg-white px-4 font-medium"
						>
							{status === "all" ? "Status" : status}{" "}
							<Icon icon="ph:caret-down" className="ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[150px]">
						<DropdownMenuItem onClick={() => setStatus("all")}>
							All Status
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("Active")}>
							Active
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("Inactive")}>
							Inactive
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatus("Suspend")}>
							Suspend
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button
					variant="outline"
					className="border-border h-10 min-w-[110px] justify-between rounded-lg bg-white px-4 font-medium"
				>
					Location <Icon icon="ph:caret-down" className="ml-2" />
				</Button>
			</div>

			{/* Customer Table */}
			{isLoading ? (
				<div className="flex h-64 w-full items-center justify-center">
					<Icon icon="line-md:loading-twotone-loop" className="text-secondary size-10" />
				</div>
			) : error ? (
				<div className="text-destructive flex h-64 w-full items-center justify-center">
					Failed to load customers. Please try again.
				</div>
			) : (
				<DataTable columns={getColumns(customerColumnsConfig)} data={customers} title="" />
			)}
		</div>
	);
}

/* eslint-enable */
