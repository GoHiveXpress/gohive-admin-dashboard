// src/components/Vendor/VendorCategoriesTab.tsx

"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import VendorCategoriesList from "@/components/List/VendorCategoriesList";
import CreateVendorCategoryModal from "@/components/_modals/CreateVendorCategoryModal";
import PermissionGate from "@/components/PermissionGate";
import { ACTION_RULES } from "@/lib/permissions";

export default function VendorCategoriesTab() {
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<div className="space-y-6">
			{/* Action Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-lg font-bold text-[#17110A]">Vendor Categories</h2>
					<p className="text-muted-foreground text-sm">
						Manage types of businesses on the platform
					</p>
				</div>

				<PermissionGate rule={ACTION_RULES.manageVendorCategories}>
					<Button
						onClick={() => setIsCreateOpen(true)}
						className="bg-secondary hover:bg-secondary/90 h-10 rounded-xl px-6 text-white shadow-sm transition-all active:scale-95"
					>
						<Icon icon="ph:plus-bold" className="mr-2 size-5" />
						Add Category
					</Button>
				</PermissionGate>
			</div>

			{/* Category Creation Modal */}
			<CreateVendorCategoryModal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />

			{/* Standardized Table Component */}
			<VendorCategoriesList />
		</div>
	);
}
