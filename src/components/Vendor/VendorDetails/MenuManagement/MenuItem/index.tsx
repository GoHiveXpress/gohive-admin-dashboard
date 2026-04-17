"use client";

import MenuItemCard from "@/components/cards/MenuItemCard";
import MenuCategoryAccordion from "@/components/_atoms/MenuCategoryAccordion";
import { useVendorMenuDetails } from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

interface MenuItemListProps {
	vendorId: string;
	searchQuery: string;
	sortMode: "asc" | "desc" | null;
	filterStatus: "all" | "available" | "unavailable";
}

export default function MenuItemList({ vendorId, searchQuery, sortMode, filterStatus }: MenuItemListProps) {
	const { data, isLoading } = useVendorMenuDetails(vendorId);

	const categories = data?.data?.categories || [];
	const items = data?.data?.items || [];

	// Filter categories to only those that are 'regular' (not extra)
	const regularCategories = categories.filter((cat: any) => cat.type === "regular" || !cat.type);

	// Pre-process items based on filters and sort
	const processedItems = useMemo(() => {
		let filtered = [...items];

		// 1. Search Query Filter
		if (searchQuery.trim() !== "") {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(item: any) =>
					item.name.toLowerCase().includes(query) ||
					(item.description && item.description.toLowerCase().includes(query))
			);
		}

		// 2. Status Filter
		if (filterStatus === "available") {
			filtered = filtered.filter((item: any) => item.isAvailable === true);
		} else if (filterStatus === "unavailable") {
			filtered = filtered.filter((item: any) => item.isAvailable === false);
		}

		// 3. A-Z Sort
		if (sortMode === "asc") {
			filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
		} else if (sortMode === "desc") {
			filtered.sort((a: any, b: any) => b.name.localeCompare(a.name));
		}

		return filtered;
	}, [items, searchQuery, sortMode, filterStatus]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="size-8 animate-spin text-secondary" />
			</div>
		);
	}


	if (regularCategories.length === 0) {
		return (
			<div className="py-12 text-center text-muted-foreground">
				No menu items found.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{regularCategories.map((cat) => {
				// Filter items belonging to this category
				const catItems = processedItems.filter((item) => {
					// Some setups return populated category object
					if (typeof item.category === "object" && item.category !== null) {
						return item.category._id === cat._id;
					}
					return item.category === cat._id;
				});

				// If we have filters applied and this category has no items matching, hide the category entirely
				if (catItems.length === 0 && (searchQuery || filterStatus !== "all" || sortMode !== null)) {
					return null;
				}

				const countText = `${catItems.length} Item${catItems.length !== 1 ? "s" : ""}`;

				return (
					<MenuCategoryAccordion
						key={cat._id}
						category={cat.name}
						count={countText}
						isOpen={true} // Default to open for admin view
					>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{catItems.map((item) => (
								<MenuItemCard
									key={item._id}
									name={item.name}
									price={item.price}
									desc={item.description || ""}
									isAvailable={item.isAvailable}
									category={cat.name}
									image={item.image || "/assets/placeholder.jpg"}
									quantity={item.quantity || 0}
								/>
							))}
						</div>
					</MenuCategoryAccordion>
				);
			})}
		</div>
	);
}
