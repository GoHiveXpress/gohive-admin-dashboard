"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing */

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
import { useState } from "react";

interface AddExtraModalProps {
	mode?: "create" | "edit";
	trigger?: React.ReactNode;
	initialData?: {
		name: string;
		price: string;
		description: string;
	};
}

export default function AddExtraModal({
	mode = "create",
	trigger,
	initialData,
}: AddExtraModalProps) {
	const isEdit = mode === "edit";

	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger || (
					<Button className="w-full rounded-lg bg-[#419A44] text-white hover:bg-[#419A44]/90">
						Add Extra
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="overflow-hidden rounded-[24px] p-0 sm:max-w-[500px]">
				<DialogHeader className="border-border/40 border-b p-6">
					<DialogTitle className="text-xl font-bold">
						{isEdit ? "Edit Extra" : "Add New Extra"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-5 p-6">
					<div className="space-y-2">
						<Label className="text-foreground/80 text-sm font-medium">Name</Label>
						<Input
							defaultValue={initialData?.name}
							placeholder="e.g Plantain"
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

					<div className="space-y-2">
						<Label className="text-foreground/80 text-sm font-medium">
							Description
						</Label>
						<Textarea
							defaultValue={initialData?.description}
							placeholder="e.g Fried Plantain"
							className="border-border min-h-[100px] resize-none rounded-xl bg-white p-3"
						/>
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
						{isEdit ? "Save Changes" : "Add Extra"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/* eslint-enable */
