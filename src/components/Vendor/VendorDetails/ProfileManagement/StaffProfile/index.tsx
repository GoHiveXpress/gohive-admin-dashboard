// src/components/Vendor/VendorDetails/ProfileManagement/StaffProfile/index.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import AddNewStaffModal from "@/components/_modals/AddNewStaffModal";
import EditStaffProfileModal from "@/components/_modals/EditStaffProfileModal";
import ConfirmDeleteModal from "@/components/_modals/ConfirmDelete";

export interface StaffData {
	id: string;
	name: string;
	role: string;
	status: "Active" | "Inactive";
	email: string;
}

const MOCK_STAFF: StaffData[] = [
	{ id: "1", name: "Peace Ali", role: "Manager", status: "Active", email: "peaceali@gmail.com" },
	{
		id: "2",
		name: "Grace Paul",
		role: "Kitchen Assistant",
		status: "Inactive",
		email: "grace@gmail.com",
	},
	{
		id: "3",
		name: "Grace Paul",
		role: "Kitchen Assistant",
		status: "Inactive",
		email: "grace2@gmail.com",
	},
];

export default function StaffProfile() {
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);

	const handleDeleteClick = (staff: StaffData) => {
		setSelectedStaff(staff);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = () => {
		// Mock delete logic
		console.log("Deleting staff:", selectedStaff?.id);
		setIsDeleteOpen(false);
	};
	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<AddNewStaffModal />
			</div>

			<div className="space-y-4">
				{MOCK_STAFF.map((staff) => (
					<div
						key={staff.id}
						className="border-border/30 hover:border-border flex items-center justify-between rounded-[16px] border bg-[#FAFAF9] p-4 transition-colors"
					>
						<div className="flex items-center gap-4">
							{/* Avatar */}
							<div className="bg-muted flex size-12 items-center justify-center rounded-full">
								<Icon icon="ph:user" className="text-muted-foreground size-6" />
							</div>

							<div className="flex flex-col">
								<span className="text-foreground text-sm font-semibold">
									{staff.name}
								</span>
								<span className="text-muted-foreground text-xs">{staff.role}</span>
							</div>
						</div>

						<div className="flex items-center gap-8">
							{/* Status Badge */}
							<Badge
								variant="outline"
								className={`min-w-[80px] justify-center rounded-full border-none px-4 py-1 font-medium ${
									staff.status === "Active"
										? "bg-secondary hover:bg-secondary text-white"
										: "bg-[#FF8A8A] text-white hover:bg-[#FF8A8A]"
								}`}
							>
								{staff.status}
							</Badge>

							{/* Actions */}
							<div className="flex items-center gap-4">
								<EditStaffProfileModal staff={staff} />
								<button 
									onClick={() => handleDeleteClick(staff)}
									className="text-muted-foreground hover:text-destructive transition-colors"
								>
									<Icon icon="ph:trash-bold" width="20" />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<ConfirmDeleteModal 
				isOpen={isDeleteOpen} 
				onOpenChange={setIsDeleteOpen} 
				onConfirm={handleConfirmDelete} 
				title="Remove Staff?"
				description={`Are you sure you want to remove ${selectedStaff?.name} from the staff list?`}
			/>
		</div>
	);
}

/* eslint-enable */
