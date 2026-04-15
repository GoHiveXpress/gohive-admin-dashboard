// src/components/_modals/AddCategoryModal/index.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function AddCategoryModal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-10 gap-2 rounded-lg bg-[#EF4444] px-4 text-white hover:bg-[#EF4444]/90">
					<Icon icon="ph:plus-circle" className="size-5" />
					Add New Category
				</Button>
			</DialogTrigger>
			<DialogContent className="rounded-[20px] bg-[#F5F5F4] p-6 sm:max-w-[400px]">
				<DialogHeader className="mb-4">
					<DialogTitle className="text-xl font-bold">Add new category</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<div className="space-y-2">
						{/* Using Select as per screenshot showing dropdown arrow */}
						<Select>
							<SelectTrigger className="text-foreground h-12 rounded-xl border-none bg-[#EBEBEB]">
								<SelectValue placeholder="Select Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="swallow">Swallow</SelectItem>
								<SelectItem value="soup">Soup</SelectItem>
								<SelectItem value="drinks">Drinks</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Button
						type="submit"
						className="h-12 w-full rounded-lg bg-[#FF5F5F] text-base font-medium text-white hover:bg-[#FF5F5F]/90"
					>
						Create New
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/* eslint-enable */
