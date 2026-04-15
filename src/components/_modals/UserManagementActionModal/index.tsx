// src/components/_modals/UserManagementActionModal/index.tsx
/* eslint-disable import/no-extraneous-dependencies, no-console, react/no-array-index-key, react/no-unused-prop-types */

"use client";

import React from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export type UserType = "customer" | "vendor" | "rider" | "admin";

interface UserManagementActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	userType: UserType;
	userName?: string;
}

export default function UserManagementActionModal({
	isOpen,
	onClose,
	userType,
}: UserManagementActionModalProps) {
	const actionsConfig = {
		customer: [
			"Suspend / Reactivate account",
			"Send message or campaign",
			"View complaint resolution status",
		],
		vendor: ["Suspend vendor", "View store details", "Assign compliance review"],
		rider: ["Suspend rider", "Assign training module", "View route logs"],
		admin: ["Add / Remove admin", "Change role or permissions", "Audit admin actions"],
	};

	const currentActions = actionsConfig[userType] || [];

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			{/* 
                Added [&>button]:hidden to hide the default Shadcn Close button 
                so only your custom one below shows up.
            */}
			<DialogContent className="gap-6 rounded-[20px] border-none bg-white p-6 shadow-lg sm:max-w-[400px] [&>button]:hidden">
				<VisuallyHidden>
					<DialogTitle>User Actions</DialogTitle>
				</VisuallyHidden>

				{/* Header: Icon and Close Button */}
				<div className="flex items-start justify-between">
					<div className="bg-primary flex size-8 items-center justify-center rounded-full">
						<Icon icon="ph:user-fill" className="size-5 text-white" />
					</div>
					<DialogClose asChild>
						<Button
							variant="ghost"
							size="icon"
							className="bg-muted/20 hover:bg-muted/40 size-8 rounded-full"
						>
							<Icon icon="ph:x" className="text-foreground size-4" />
						</Button>
					</DialogClose>
				</div>

				{/* Dynamic Buttons */}
				<div className="flex flex-col gap-4">
					{currentActions.map((action, index) => (
						<Button
							key={index}
							variant="outline"
							className="border-border text-foreground hover:bg-muted/10 hover:border-primary/50 h-14 w-full justify-start whitespace-normal rounded-2xl text-left text-sm font-medium transition-all sm:text-base"
							onClick={() => {
								console.log(`Clicked: ${action}`);
								onClose();
							}}
						>
							{action}
						</Button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

/* eslint-enable */
