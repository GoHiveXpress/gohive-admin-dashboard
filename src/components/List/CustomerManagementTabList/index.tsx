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
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function CustomerManagementTabList() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<"all" | "Active" | "Inactive" | "Suspend">("all");
	const [sortMode, setSortMode] = useState<"asc" | "desc" | null>(null);

	const { data: customerResponse, isLoading, error } = useCustomers({ search, status });
	const customers = customerResponse?.data ?? [];

	const processedCustomers = useMemo(() => {
		const result = [...customers];
		if (sortMode === "asc") {
			result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
		} else if (sortMode === "desc") {
			result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
		}
		return result;
	}, [customers, sortMode]);

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Filter Button */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="border-border relative size-10 shrink-0 rounded-lg"
						>
							<Icon icon="ph:sliders-horizontal" className="size-5" />
							{status !== "all" && (
								<span className="absolute right-0 top-0 size-2 rounded-full bg-[#F97316]" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 z-50 bg-white">
						<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem
							checked={status === "all"}
							onCheckedChange={() => setStatus("all")}
						>
							All Statuses
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "Active"}
							onCheckedChange={() => setStatus("Active")}
						>
							Active
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "Inactive"}
							onCheckedChange={() => setStatus("Inactive")}
						>
							Inactive
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={status === "Suspend"}
							onCheckedChange={() => setStatus("Suspend")}
						>
							Suspend
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Quick Filters */}
				<Button
					onClick={() => setStatus("all")}
					className={cn(
						"h-10 rounded-lg px-6 font-medium transition-colors",
						status === "all"
							? "bg-[#F97316] text-white hover:bg-[#F97316]/90"
							: "bg-muted text-foreground hover:bg-muted/80"
					)}
				>
					All
				</Button>
				<Button
					variant={sortMode !== null ? "default" : "outline"}
					onClick={() => setSortMode((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"))}
					className={cn(
						"h-10 rounded-lg px-6 font-medium",
						sortMode !== null ? "bg-[#123614] text-white hover:bg-[#123614]/90" : "border-border"
					)}
				>
					A-Z {sortMode === "asc" ? "↓" : sortMode === "desc" ? "↑" : ""}
				</Button>

				<div className="bg-border mx-1 hidden h-6 w-px sm:block" />

				{/* Search */}
				<div className="relative w-full sm:w-64">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="border-border h-10 rounded-lg bg-white pl-10"
					/>
				</div>
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
				<DataTable columns={getColumns(customerColumnsConfig)} data={processedCustomers} title="" />
			)}
		</div>
	);
}

/* eslint-enable */
