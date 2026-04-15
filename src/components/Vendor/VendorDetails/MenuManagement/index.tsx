// src/components/Vendor/VendorDetails/MenuManagement/index.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import AddCategoryModal from "@/components/_modals/AddCategoryModal";
import MenuItemList from "./MenuItem";
import AddExtraList from "./AddExtra";

const MENU_SUB_TABS = [
	{ label: "Menu Items", value: "Menu Items" },
	{ label: "Add Extra", value: "Add Extra" },
];

export default function MenuManagementTab() {
	const [activeSubTab, setActiveSubTab] = useState("Menu Items");

	return (
		<div className="border-border/50 min-h-[600px] rounded-[24px] border bg-white p-6 shadow-sm">
			{/* Header / Toolbar */}
			<div className="mb-8 flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-center">
				{/* Sub Tabs */}
				<div className="bg-muted/20 flex items-center gap-1 rounded-full p-1">
					{MENU_SUB_TABS.map((tab) => {
						const isActive = activeSubTab === tab.value;
						return (
							<Button
								key={tab.value}
								onClick={() => setActiveSubTab(tab.value)}
								variant="ghost"
								className={`h-10 rounded-full px-6 text-sm font-semibold transition-all ${
									isActive
										? "bg-[#123614] text-white shadow-md hover:bg-[#123614]/90"
										: "text-muted-foreground hover:text-foreground hover:bg-white"
								}`}
							>
								{tab.label}
							</Button>
						);
					})}
				</div>

				{/* Actions Toolbar */}
				<div className="flex w-full flex-col items-center gap-3 sm:flex-row xl:w-auto">
					{/* Filter Button */}
					<Button
						variant="outline"
						size="icon"
						className="border-border size-10 shrink-0 rounded-lg"
					>
						<Icon icon="ph:sliders-horizontal" className="size-5" />
					</Button>

					{/* Quick Filters */}
					<Button className="h-10 rounded-lg bg-[#F97316] px-6 font-medium text-white hover:bg-[#F97316]/90">
						All
					</Button>
					<Button
						variant="outline"
						className="border-border h-10 rounded-lg px-6 font-medium"
					>
						A-Z
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
							className="border-border h-10 rounded-lg bg-white pl-10"
						/>
					</div>

					{/* Add Category Trigger */}
					<div className="w-full sm:w-auto">
						<AddCategoryModal />
					</div>
				</div>
			</div>

			{/* Tab Content */}
			<div className="animate-in fade-in zoom-in-95 duration-200">
				{activeSubTab === "Menu Items" && <MenuItemList />}
				{activeSubTab === "Add Extra" && <AddExtraList />}
			</div>
		</div>
	);
}
