// src/components/cards/MenuItemCard/index.tsx
/* eslint-disable @next/next/no-img-element */

"use client";

import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
	name: string;
	price: string | number;
	desc: string;
	isAvailable: boolean;
	image: string;
	quantity?: number;
	hiddenByAdmin?: boolean;
	hiddenReason?: string | null;
	// Admin controls shown under the badges
	actions?: ReactNode;
}

export default function MenuItemCard({
	name,
	price,
	desc,
	isAvailable,
	image,
	quantity = 0,
	hiddenByAdmin = false,
	hiddenReason,
	actions,
}: MenuItemCardProps) {
	return (
		<div
			className={cn(
				"border-border group flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md",
				hiddenByAdmin && "border-destructive/30",
			)}
		>
			<div className="bg-muted relative h-40 w-full overflow-hidden">
				<img
					src={image}
					alt={name}
					className={cn(
						"size-full object-cover transition-transform duration-500 group-hover:scale-105",
						hiddenByAdmin && "opacity-50 grayscale",
					)}
				/>
				{hiddenByAdmin && (
					<Badge className="bg-destructive absolute left-3 top-3 rounded-md border-none text-xs text-white">
						Hidden by admin
					</Badge>
				)}
			</div>

			<div className="flex flex-1 flex-col p-4">
				<h4 className="text-foreground mb-1 text-base font-semibold">{name}</h4>
				<p className="text-muted-foreground mb-4 text-xs">{desc}</p>
				{hiddenByAdmin && hiddenReason && (
					<p className="text-destructive mb-3 text-xs">Hidden: {hiddenReason}</p>
				)}

				<div className="mt-auto flex flex-wrap items-center gap-2">
					<Badge
						variant="outline"
						className="rounded-md border-[#FFD6D6] bg-[#FFF1F2] px-2.5 py-0.5 text-xs font-medium text-[#FF5F5F]"
					>
						₦{price.toLocaleString()}
					</Badge>
					<Badge
						variant="outline"
						className={cn(
							"rounded-md border-none px-2.5 py-0.5 text-xs font-medium",
							isAvailable
								? "bg-[#E8F5E9] text-[#22C55E]"
								: "bg-muted text-muted-foreground",
						)}
					>
						{isAvailable ? "Available" : "Unavailable"}
					</Badge>
					<Badge
						variant="outline"
						className="rounded-md border-none bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#374151]"
					>
						Qty: {quantity}
					</Badge>
				</div>
				{actions && <div className="mt-3">{actions}</div>}
			</div>
		</div>
	);
}
/* eslint-enable @next/next/no-img-element */
