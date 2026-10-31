// src/components/_modals/ConfirmReasonModal/index.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Matches gohive-backend/utils/adminReason.js
const REASON_MIN_LENGTH = 3;
const REASON_MAX_LENGTH = 500;

interface ConfirmReasonModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (reason: string) => void;
	title: string;
	description: string;
	confirmLabel: string;
	reasonLabel?: string;
	placeholder?: string;
	// Required reasons are stored, shown in the audit log and sent to the user.
	reasonRequired?: boolean;
	tone?: "danger" | "success";
	isLoading?: boolean;
}

export default function ConfirmReasonModal({
	isOpen,
	onOpenChange,
	onConfirm,
	title,
	description,
	confirmLabel,
	reasonLabel = "Reason",
	placeholder = "Explain why. The user will see this.",
	reasonRequired = true,
	tone = "danger",
	isLoading = false,
}: ConfirmReasonModalProps) {
	const [reason, setReason] = useState("");
	const [touched, setTouched] = useState(false);

	// Start blank each time the dialog opens
	useEffect(() => {
		if (isOpen) {
			setReason("");
			setTouched(false);
		}
	}, [isOpen]);

	const trimmed = reason.trim();
	let error: string | null = null;
	if (!trimmed && reasonRequired) error = "Please give a reason.";
	else if (trimmed && trimmed.length < REASON_MIN_LENGTH)
		error = `The reason must be at least ${REASON_MIN_LENGTH} characters.`;

	const handleConfirm = () => {
		setTouched(true);
		if (error) return;
		onConfirm(trimmed);
	};

	const isDanger = tone === "danger";

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
			<DialogContent className="overflow-hidden rounded-[24px] border-none p-0 shadow-2xl sm:max-w-[440px]">
				<div
					className={cn(
						"flex h-20 items-center px-6",
						isDanger ? "bg-destructive/10" : "bg-green-50",
					)}
				>
					<div
						className={cn(
							"flex size-10 items-center justify-center rounded-xl shadow-lg",
							isDanger ? "bg-destructive shadow-destructive/20" : "bg-green-600",
						)}
					>
						<Icon
							icon={isDanger ? "ph:warning-duotone" : "ph:check-circle-duotone"}
							className="size-6 text-white"
						/>
					</div>
					<DialogHeader className="ml-4 p-0 text-left">
						<DialogTitle className="text-lg font-bold text-[#17110A]">
							{title}
						</DialogTitle>
					</DialogHeader>
				</div>

				<div className="space-y-4 p-6">
					<DialogDescription className="text-muted-foreground text-sm leading-relaxed">
						{description}
					</DialogDescription>

					<div className="space-y-2">
						<Label htmlFor="confirm-reason">
							{reasonLabel}
							{!reasonRequired && (
								<span className="text-muted-foreground font-normal">
									{" "}
									(optional)
								</span>
							)}
						</Label>
						<Textarea
							id="confirm-reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							onBlur={() => setTouched(true)}
							placeholder={placeholder}
							maxLength={REASON_MAX_LENGTH}
							rows={4}
							disabled={isLoading}
							aria-invalid={touched && !!error}
							aria-describedby="confirm-reason-hint"
							className="resize-none rounded-xl"
						/>
						<div id="confirm-reason-hint" className="flex justify-between text-xs">
							<span className="text-destructive">{touched ? error : null}</span>
							<span className="text-muted-foreground">
								{reason.length}/{REASON_MAX_LENGTH}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-3 pt-2">
						<Button
							type="button"
							variant="ghost"
							className="text-muted-foreground h-11 flex-1 rounded-xl font-bold hover:bg-gray-100"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant={isDanger ? "destructive" : "default"}
							className={cn(
								"h-11 flex-[1.5] rounded-xl font-bold text-white transition-all active:scale-95",
								!isDanger && "bg-green-600 hover:bg-green-700",
							)}
							onClick={handleConfirm}
							disabled={isLoading}
						>
							{isLoading && (
								<Icon icon="line-md:loading-twotone-loop" className="mr-2 size-5" />
							)}
							{confirmLabel}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
