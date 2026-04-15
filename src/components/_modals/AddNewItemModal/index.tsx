// src/components/_modals/AddNewItemModal/index.tsx
/* eslint-disable @next/next/no-img-element, @typescript-eslint/prefer-nullish-coalescing */

"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface AddItemProps {
	mode?: "create" | "edit";
	categoryName?: string;
	trigger?: React.ReactNode;
	initialData?: {
		name: string;
		price: string;
		description: string;
		isAvailable: boolean;
		category: string;
	};
}

export default function AddNewItemModal({
	mode = "create",
	categoryName,
	trigger,
	initialData,
}: AddItemProps) {
	const isEdit = mode === "edit";
	const [availability, setAvailability] = useState<"available" | "unavailable">(
		initialData?.isAvailable === false ? "unavailable" : "available",
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm" className="h-8 gap-1 rounded-full text-xs">
						<Icon icon="ph:plus" /> Add Item
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="overflow-hidden rounded-[24px] p-0 sm:max-w-[700px]">
				<DialogHeader className="border-border/40 border-b p-6">
					<DialogTitle className="text-xl font-bold">
						{isEdit ? "Edit Menu Item" : "Add New Menu Item"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-5 p-6">
					{/* Image Upload Area */}
					<div className="space-y-2">
						<Label className="text-foreground/80 text-sm font-medium">Item Image</Label>
						<div className="border-border bg-muted/5 group relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border">
							{isEdit ? (
								// Mock Image for Edit Mode
								<img
									src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1000&auto=format&fit=crop"
									alt="Item"
									className="size-full object-cover"
								/>
							) : (
								<div className="text-muted-foreground flex flex-col items-center">
									<Icon icon="ph:image" className="mb-2 size-8" />
									<span className="text-xs">Click to upload image</span>
								</div>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-5">
						<div className="space-y-2">
							<Label className="text-foreground/80 text-sm font-medium">
								Item Name
							</Label>
							<Input
								defaultValue={initialData?.name}
								placeholder={isEdit ? "Fried Rice" : "e.g Fried Rice"}
								className="border-border h-12 rounded-xl bg-white"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-foreground/80 text-sm font-medium">Price</Label>
							<div className="relative">
								<span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 font-medium">
									₦
								</span>
								<Input
									defaultValue={initialData?.price}
									placeholder="00.00"
									className="border-border h-12 rounded-xl bg-white pl-8"
								/>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-foreground/80 text-sm font-medium">Category</Label>
						<div className="flex flex-wrap gap-2">
							{["Swallow", "Extra", "Protein", "Drinks", "Lunch", "Breakfast"].map(
								(tag) => {
									const isActive =
										tag ===
										(categoryName || initialData?.category || "Swallow");
									return (
										<Badge
											key={tag}
											variant="outline"
											className={`cursor-pointer rounded-full border px-5 py-2 font-normal ${
												isActive
													? "border-[#419A44] bg-[#419A44] text-white"
													: "text-foreground border-border hover:bg-muted bg-white"
											}`}
										>
											{tag}
										</Badge>
									);
								},
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-foreground/80 text-sm font-medium">
							Description
						</Label>
						<Textarea
							defaultValue={initialData?.description}
							placeholder="e.g Fried Plantain"
							className="border-border h-24 resize-none rounded-xl bg-white p-3"
						/>
					</div>

					<div className="space-y-2">
						<Label className="text-foreground/80 text-sm font-medium">
							Availability
						</Label>
						<div className="flex gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setAvailability("available")}
								className={`h-11 flex-1 rounded-xl border ${
									availability === "available"
										? "border-[#419A44] bg-[#E8F5E9] text-[#419A44] hover:bg-[#E8F5E9]"
										: "text-muted-foreground border-border bg-white"
								}`}
							>
								Available
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => setAvailability("unavailable")}
								className={`h-11 flex-1 rounded-xl border ${
									availability === "unavailable"
										? "border-[#419A44] bg-[#E8F5E9] text-[#419A44] hover:bg-[#E8F5E9]"
										: "text-muted-foreground border-border bg-white"
								}`}
							>
								Unavailable
							</Button>
						</div>
					</div>
				</div>

				<DialogFooter className="gap-3 p-6 pt-2">
					<DialogClose asChild>
						<Button
							variant="outline"
							className="text-foreground/70 h-12 flex-1 rounded-xl border-none bg-[#D1D5DB]/30 hover:bg-[#D1D5DB]/50"
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="submit"
						className="h-12 flex-1 rounded-xl bg-[#419A44] text-white hover:bg-[#419A44]/90"
					>
						{isEdit ? "Save Changes" : "Add Item"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/* eslint-enable */
