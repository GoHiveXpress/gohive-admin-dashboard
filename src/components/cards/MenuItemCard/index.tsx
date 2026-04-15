"use client";

/* eslint-disable @next/next/no-img-element */

import { Badge } from "@/components/ui/badge";
import AddNewItemModal from "@/components/_modals/AddNewItemModal";

interface MenuItemCardProps {
	name: string;
	price: string | number;
	desc: string;
	isAvailable: boolean;
	category: string;
	image: string;
}

export default function MenuItemCard({
	name,
	price,
	desc,
	isAvailable,
	category,
	image,
}: MenuItemCardProps) {
	return (
		<AddNewItemModal
			mode="edit"
			categoryName={category}
			initialData={{
				name,
				price: price.toString(),
				description: desc,
				isAvailable,
				category,
			}}
			trigger={
				<div className="border-border group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
					{/* Image Area */}
					<div className="bg-muted relative h-40 w-full overflow-hidden">
						<img
							src={image}
							alt={name}
							className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>

					{/* Content Area */}
					<div className="flex flex-1 flex-col p-4">
						<h4 className="text-foreground mb-1 text-base font-semibold">{name}</h4>
						<p className="text-muted-foreground mb-4 text-xs">{desc}</p>

						<div className="mt-auto flex items-center gap-2">
							<Badge
								variant="outline"
								className="rounded-md border-[#FFD6D6] bg-[#FFF1F2] px-2.5 py-0.5 text-xs font-medium text-[#FF5F5F]"
							>
								#{price}
							</Badge>

							<Badge
								variant="outline"
								className={`rounded-md border-none px-2.5 py-0.5 text-xs font-medium ${
									isAvailable
										? "bg-[#E8F5E9] text-[#22C55E]"
										: "bg-muted text-muted-foreground"
								}`}
							>
								{isAvailable ? "Available" : "Unavailable"}
							</Badge>
						</div>
					</div>
				</div>
			}
		/>
	);
}

/* eslint-enable */
