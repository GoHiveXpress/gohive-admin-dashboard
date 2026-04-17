// src/components/Vendor/VendorDetails/MenuManagement/index.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";

import MenuItemList from "./MenuItem";
import AddExtraList from "./AddExtra";
import CustomTabs from "@/components/Tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MENU_SUB_TABS = [
	{ id: "Menu Items", label: "Menu Items" },
	{ id: "Add Extra", label: "Add Extra" },
];

export default function MenuManagementTab({ vendorId }: { vendorId: string }) {
	const [activeSubTab, setActiveSubTab] = useState("Menu Items");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortMode, setSortMode] = useState<"asc" | "desc" | null>(null);
	const [filterStatus, setFilterStatus] = useState<"all" | "available" | "unavailable">("all");

	return (
		<div className="border-border/50 min-h-[600px] rounded-[24px] border bg-white p-6 shadow-sm">
			{/* Header / Toolbar */}
			<div className="mb-8 flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-center">
				<div className="bg-muted/30 flex w-full max-w-full items-center overflow-hidden rounded-[2rem] p-1.5 xl:w-fit">
					<CustomTabs
						items={MENU_SUB_TABS}
						activeTab={activeSubTab}
						onTabChange={setActiveSubTab}
					/>
				</div>

				{/* Actions Toolbar */}
				<div className="flex w-full flex-col items-center gap-3 sm:flex-row xl:w-auto">
					{/* Filter Button */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="border-border relative size-10 shrink-0 rounded-lg"
							>
								<Icon icon="ph:sliders-horizontal" className="size-5" />
								{filterStatus !== "all" && (
									<span className="absolute right-0 top-0 size-2 rounded-full bg-[#F97316]" />
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48 bg-white z-50">
							<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem
								checked={filterStatus === "all"}
								onCheckedChange={() => setFilterStatus("all")}
							>
								All Items
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={filterStatus === "available"}
								onCheckedChange={() => setFilterStatus("available")}
							>
								Available Only
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={filterStatus === "unavailable"}
								onCheckedChange={() => setFilterStatus("unavailable")}
							>
								Unavailable Only
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Quick Filters */}
					<Button
						onClick={() => setFilterStatus("all")}
						className={cn(
							"h-10 rounded-lg px-6 font-medium transition-colors",
							filterStatus === "all"
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
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="border-border h-10 rounded-lg bg-white pl-10"
						/>
					</div>

					{/* Removed Add Category Trigger logic for Admin readonly view */}
				</div>
			</div>

			{/* Tab Content */}
			<div className="animate-in fade-in zoom-in-95 duration-200">
				{activeSubTab === "Menu Items" && (
					<MenuItemList
						vendorId={vendorId}
						searchQuery={searchQuery}
						sortMode={sortMode}
						filterStatus={filterStatus}
					/>
				)}
				{activeSubTab === "Add Extra" && (
					<AddExtraList
						vendorId={vendorId}
						searchQuery={searchQuery}
						sortMode={sortMode}
						filterStatus={filterStatus}
					/>
				)}
			</div>
		</div>
	);
}
