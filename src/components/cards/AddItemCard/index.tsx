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
                <button className="h-full min-h-[250px] w-full bg-[#FAFAFA] rounded-xl border border-border hover:bg-white hover:border-[#FF5F5F]/50 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-3 group">
                    <div className="w-12 h-12 rounded-full bg-[#FF5F5F] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icon icon="ph:plus-bold" width="20" />
                    </div>
                    <span className="font-medium text-sm text-foreground">Add item</span>
                </button>
            }
        />
    );
}