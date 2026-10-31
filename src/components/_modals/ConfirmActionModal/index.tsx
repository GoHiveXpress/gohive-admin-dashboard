// src/components/_modals/ConfirmActionModal/index.tsx
// A yes/no confirmation with a custom button label, for actions that need no reason.

"use client";

import { Icon } from "@iconify/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmActionModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmLabel: string;
	tone?: "danger" | "neutral";
	isLoading?: boolean;
}

export default function ConfirmActionModal({
	isOpen,
	onOpenChange,
	onConfirm,
	title,
	description,
	confirmLabel,
	tone = "neutral",
	isLoading = false,
}: ConfirmActionModalProps) {
	const isDanger = tone === "danger";
	return (
		<Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
			<DialogContent className="overflow-hidden rounded-[24px] border-none p-0 shadow-2xl sm:max-w-[420px]">
				<div
					className={cn(
						"flex h-20 items-center px-6",
						isDanger ? "bg-destructive/10" : "bg-muted/60",
					)}
				>
					<div
						className={cn(
							"flex size-10 items-center justify-center rounded-xl shadow-lg",
							isDanger ? "bg-destructive shadow-destructive/20" : "bg-foreground",
						)}
					>
						<Icon
							icon={isDanger ? "ph:warning-duotone" : "ph:question-duotone"}
							className="size-6 text-white"
						/>
					</div>
					<DialogHeader className="ml-4 p-0 text-left">
						<DialogTitle className="text-lg font-bold text-[#17110A]">
							{title}
						</DialogTitle>
					</DialogHeader>
				</div>
				<div className="space-y-6 p-6">
					<DialogDescription className="text-muted-foreground text-sm leading-relaxed">
						{description}
					</DialogDescription>
					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							className="h-11 flex-1 rounded-xl"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							variant={isDanger ? "destructive" : "default"}
							className="h-11 flex-1 rounded-xl"
							onClick={onConfirm}
							disabled={isLoading}
						>
							{isLoading ? "Working…" : confirmLabel}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
