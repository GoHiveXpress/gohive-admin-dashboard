// src/components/_modals/ConfirmDelete/index.tsx
"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	isLoading?: boolean;
}

export default function ConfirmDeleteModal({
	isOpen,
	onOpenChange,
	onConfirm,
	title = "Are you sure?",
	description = "This action cannot be undone. This will permanently delete the selected data from our servers.",
	isLoading = false,
}: ConfirmDeleteModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[400px] overflow-hidden rounded-[24px] border-none p-0 shadow-2xl">
				<div className="bg-destructive/10 flex h-20 items-center px-6">
					<div className="bg-destructive flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-destructive/20">
						<Icon icon="ph:warning-duotone" className="size-6 text-white" />
					</div>
					<div className="ml-4">
						<DialogHeader className="p-0 text-left">
							<DialogTitle className="text-lg font-bold text-[#17110A]">{title}</DialogTitle>
						</DialogHeader>
					</div>
				</div>

				<div className="p-6">
					<p className="text-sm text-muted-foreground leading-relaxed">
						{description}
					</p>

					<div className="flex items-center gap-3 pt-6">
						<Button
							type="button"
							variant="ghost"
							className="h-11 flex-1 rounded-xl font-bold text-muted-foreground hover:bg-gray-100"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							className="h-11 flex-[1.5] rounded-xl font-bold text-white shadow-lg shadow-destructive/10 transition-all active:scale-95"
							onClick={() => {
								onConfirm();
							}}
							disabled={isLoading}
						>
							{isLoading ? (
								<Icon icon="line-md:loading-twotone-loop" className="mr-2 size-5" />
							) : (
								<Icon icon="ph:trash-bold" className="mr-2 size-5" />
							)}
							Confirm Delete
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
