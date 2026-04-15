"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SettingsActionModal from "@/components/_modals/SettingsActionModal";

interface RoleActionCellProps {
	row: {
		id: string;
		name: string;
		adminId: string;
		role: string;
	};
}

export default function RoleActionCell({ row }: RoleActionCellProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Button
				onClick={() => setIsModalOpen(true)}
				variant="outline"
				className="text-accent hover:text-accent h-9 rounded-full border-orange-100 bg-orange-50 px-6 font-medium hover:bg-orange-100"
			>
				Set permission
			</Button>

			<SettingsActionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				userData={row}
			/>
		</>
	);
}
