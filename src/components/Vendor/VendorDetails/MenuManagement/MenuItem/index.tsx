// src/components/Vendor/VendorDetails/MenuManagement/MenuItem/index.tsx
// The vendor's regular menu items by category. Admins can hide an item from
// customers (with a reason the vendor sees) or show it again.

"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import MenuItemCard from "@/components/cards/MenuItemCard";
import MenuCategoryAccordion from "@/components/_atoms/MenuCategoryAccordion";
import ConfirmReasonModal from "@/components/_modals/ConfirmReasonModal";
import { Button } from "@/components/ui/button";
import { useSetMenuItemVisibility } from "@/hooks/useAccountTools";
import { usePermissions } from "@/hooks/usePermissions";
import { useVendorMenuDetails } from "@/hooks/vendorManagement";
import { ACTION_RULES } from "@/lib/permissions";
import { type MenuItem } from "@/types/vendorManagement";

interface MenuItemListProps {
	vendorId: string;
	searchQuery: string;
	sortMode: "asc" | "desc" | null;
	filterStatus: "all" | "available" | "unavailable";
}

const categoryIdOf = (item: MenuItem) =>
	typeof item.category === "object" ? item.category._id : item.category;

export default function MenuItemList({
	vendorId,
	searchQuery,
	sortMode,
	filterStatus,
}: MenuItemListProps) {
	const { data, isLoading } = useVendorMenuDetails(vendorId);
	const { allows } = usePermissions();
	const canHide = allows(ACTION_RULES.manageVendorStore);
	const visibility = useSetMenuItemVisibility(vendorId);
	const [hiding, setHiding] = useState<MenuItem | null>(null);

	const categories = data?.data?.categories ?? [];
	const regularCategories = categories.filter((cat) => cat.type !== "extra");

	const processedItems = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const filtered = (data?.data?.items ?? []).filter((item) => {
			if (
				query &&
				!item.name.toLowerCase().includes(query) &&
				!(item.description ?? "").toLowerCase().includes(query)
			) {
				return false;
			}
			if (filterStatus === "available") return item.isAvailable;
			if (filterStatus === "unavailable") return !item.isAvailable;
			return true;
		});
		if (sortMode === "asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
		if (sortMode === "desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
		return filtered;
	}, [data, searchQuery, sortMode, filterStatus]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	if (regularCategories.length === 0) {
		return <div className="text-muted-foreground py-12 text-center">No menu items found.</div>;
	}

	const isFiltering = !!searchQuery || filterStatus !== "all" || sortMode !== null;

	return (
		<div className="space-y-4">
			{regularCategories.map((cat) => {
				const catItems = processedItems.filter((item) => categoryIdOf(item) === cat._id);
				if (catItems.length === 0 && isFiltering) return null;
				const countText = `${catItems.length} Item${catItems.length !== 1 ? "s" : ""}`;

				return (
					<MenuCategoryAccordion
						key={cat._id}
						category={cat.name}
						count={countText}
						isOpen
					>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{catItems.map((item) => (
								<MenuItemCard
									key={item._id}
									name={item.name}
									price={item.price}
									desc={item.description ?? ""}
									isAvailable={item.isAvailable}
									image={item.image ?? "/assets/placeholder.jpg"}
									quantity={item.quantity ?? 0}
									hiddenByAdmin={item.hiddenByAdmin}
									hiddenReason={item.hiddenReason}
									actions={
										canHide &&
										(item.hiddenByAdmin ? (
											<Button
												size="sm"
												variant="outline"
												className="w-full"
												disabled={visibility.isPending}
												onClick={() =>
													visibility.mutate({
														itemId: item._id,
														hidden: false,
													})
												}
											>
												Show to customers
											</Button>
										) : (
											<Button
												size="sm"
												variant="outline"
												className="border-destructive/30 text-destructive hover:bg-destructive/5 w-full"
												onClick={() => setHiding(item)}
											>
												Hide from customers
											</Button>
										))
									}
								/>
							))}
						</div>
					</MenuCategoryAccordion>
				);
			})}

			<ConfirmReasonModal
				isOpen={hiding !== null}
				onOpenChange={(open) => !open && setHiding(null)}
				title={`Hide ${hiding?.name ?? "this item"}?`}
				description="Customers stop seeing it and can't order it, whatever the vendor sets. The vendor is told why and can't show it again; only an admin can."
				confirmLabel="Hide item"
				placeholder="e.g. Photo shows a different dish"
				isLoading={visibility.isPending}
				onConfirm={(reason) => {
					if (!hiding) return;
					visibility
						.mutateAsync({ itemId: hiding._id, hidden: true, reason })
						.then(() => setHiding(null))
						.catch(() => undefined);
				}}
			/>
		</div>
	);
}
