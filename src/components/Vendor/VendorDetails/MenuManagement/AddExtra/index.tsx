"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, no-use-before-define */

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";


import { useVendorMenuDetails } from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

interface AddExtraListProps {
	vendorId: string;
	searchQuery: string;
	sortMode: "asc" | "desc" | null;
	filterStatus: "all" | "available" | "unavailable";
}

export default function AddExtraList({ vendorId, searchQuery, sortMode, filterStatus }: AddExtraListProps) {
	const { data, isLoading } = useVendorMenuDetails(vendorId);

	const extras = data?.data?.extras || [];

	const processedExtras = useMemo(() => {
		let filtered = [...extras];

		if (searchQuery.trim() !== "") {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(item: any) =>
					item.name.toLowerCase().includes(query) ||
					(item.description && item.description.toLowerCase().includes(query))
			);
		}

		if (filterStatus === "available") {
			filtered = filtered.filter((item: any) => item.isAvailable === true);
		} else if (filterStatus === "unavailable") {
			filtered = filtered.filter((item: any) => item.isAvailable === false);
		}

		if (sortMode === "asc") {
			filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
		} else if (sortMode === "desc") {
			filtered.sort((a: any, b: any) => b.name.localeCompare(a.name));
		}

		return filtered;
	}, [extras, searchQuery, sortMode, filterStatus]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="size-8 animate-spin text-secondary" />
			</div>
		);
	}

	if (processedExtras.length === 0) {
		return (
			<div className="py-12 text-center text-muted-foreground">
				No matching extra items found.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{processedExtras.map((extra) => (
				<ExtraItemRow
					key={extra._id}
					name={extra.name}
					detail={extra.description || "N/A"}
					price={extra.price.toString()}
					isAvailable={extra.isAvailable}
					quantity={extra.quantity || 0}
				/>
			))}
		</div>
	);
}

function ExtraItemRow({ name, detail, price, isAvailable, quantity }: any) {
	return (
		<div className="border-border flex flex-col justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
			<span className="text-foreground font-medium">{name}</span>

			<div className="flex flex-wrap items-center gap-3 sm:gap-4">
				<Badge
					variant="secondary"
					className="rounded-md border-none bg-[#FFE4E6] font-normal text-[#BE123C] hover:bg-[#FFE4E6]"
				>
					{detail}
				</Badge>

				<Badge
					variant="outline"
					className="rounded-md border-[#FEF08A] bg-[#FEFCE8] font-medium text-[#A16207]"
				>
					₦ {price}
				</Badge>

				<Badge className="rounded-md border-none bg-[#DCFCE7] font-medium text-[#15803D] shadow-none hover:bg-[#DCFCE7]">
					{isAvailable ? "Available" : "Unavailable"}
				</Badge>

			</div>
		</div>
	);
}

/* eslint-enable */
