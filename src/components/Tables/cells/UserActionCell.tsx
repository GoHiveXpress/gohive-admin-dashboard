"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import UserManagementActionModal, {
	type UserType,
} from "@/components/_modals/UserManagementActionModal";

interface UserActionCellProps {
	userType: UserType;
	rowId: string; // Useful if you need to perform API actions
}

export default function UserActionCell({ userType, rowId }: UserActionCellProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className="size-8"
				onClick={() => setIsModalOpen(true)}
			>
				<Icon icon="ph:dots-three-vertical-bold" className="text-muted-foreground size-5" />
			</Button>

			<UserManagementActionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				userType={userType}
				userId={rowId}
			/>
		</>
	);
}

/* eslint-enable */
