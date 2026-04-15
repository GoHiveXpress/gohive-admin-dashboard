"use client";

import { Icon } from "@iconify/react";
import AddNewItemModal from "@/components/_modals/AddNewItemModal";

interface AddItemCardProps {
	category: string;
}

export default function AddItemCard({ category }: AddItemCardProps) {
	return (
		<AddNewItemModal
			mode="create"
			categoryName={category}
			trigger={
				<button className="border-border group flex size-full min-h-[250px] flex-col items-center justify-center gap-3 rounded-xl border bg-[#FAFAFA] transition-all hover:border-[#FF5F5F]/50 hover:bg-white hover:shadow-sm">
					<div className="flex size-12 items-center justify-center rounded-full bg-[#FF5F5F] text-white shadow-lg transition-transform group-hover:scale-110">
						<Icon icon="ph:plus-bold" width="20" />
					</div>
					<span className="text-foreground text-sm font-medium">Add item</span>
				</button>
			}
		/>
	);
}
