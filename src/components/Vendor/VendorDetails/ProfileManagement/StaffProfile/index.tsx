// src/components/Vendor/VendorDetails/ProfileManagement/StaffProfile/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import ConfirmDeleteModal from "@/components/_modals/ConfirmDelete";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCreateVendorStaff,
	useDeleteVendorStaff,
	useUpdateVendorStaff,
	useVendorStaff,
} from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";
import { type VendorStaffMember } from "@/types/vendorManagement";

export interface StaffData {
	id: string;
	name: string;
	role: string;
	status: "Active" | "Inactive";
	email: string;
	phone?: string;
}

const initialForm = {
	name: "",
	role: "",
	email: "",
	phone: "",
	status: "Active" as "Active" | "Inactive",
};

export default function StaffProfile({ vendorId }: { vendorId: string }) {
	const { data: staffResponse, isLoading } = useVendorStaff(vendorId);
	const createMutation = useCreateVendorStaff(vendorId);
	const updateMutation = useUpdateVendorStaff(vendorId);
	const deleteMutation = useDeleteVendorStaff(vendorId);

	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [formData, setFormData] = useState(initialForm);

	const staffList = useMemo<StaffData[]>(() => {
		return (staffResponse?.data ?? []).map((staff: VendorStaffMember) => ({
			id: staff._id,
			name: staff.name,
			role: staff.role,
			status: staff.status,
			email: staff.email,
			phone: staff.phone,
		}));
	}, [staffResponse]);

	const handleDeleteClick = (staff: StaffData) => {
		setSelectedStaff(staff);
		setIsDeleteOpen(true);
	};

	const openCreate = () => {
		setFormData(initialForm);
		setIsCreateOpen(true);
	};

	const openEdit = (staff: StaffData) => {
		setSelectedStaff(staff);
		setFormData({
			name: staff.name,
			role: staff.role,
			email: staff.email,
			phone: staff.phone || "",
			status: staff.status,
		});
		setIsEditOpen(true);
	};

	const handleCreate = async () => {
		await createMutation.mutateAsync({
			name: formData.name,
			role: formData.role,
			email: formData.email,
			phone: formData.phone,
		});
		setIsCreateOpen(false);
	};

	const handleUpdate = async () => {
		if (!selectedStaff) return;

		await updateMutation.mutateAsync({
			staffId: selectedStaff.id,
			payload: {
				name: formData.name,
				role: formData.role,
				email: formData.email,
				phone: formData.phone,
				status: formData.status,
			},
		});

		setIsEditOpen(false);
	};

	const handleConfirmDelete = async () => {
		if (!selectedStaff) return;
		await deleteMutation.mutateAsync(selectedStaff.id);
		setIsDeleteOpen(false);
	};

	if (isLoading) {
		return (
			<div className="flex h-48 items-center justify-center">
				<Loader2 className="text-secondary size-7 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<Button onClick={openCreate} className="bg-secondary hover:bg-secondary/90 gap-2 rounded-full px-6 text-white">
					<Icon icon="ph:plus-circle" className="size-5" />
					Add New Staff
				</Button>
			</div>

			<div className="space-y-4">
				{staffList.map((staff) => (
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
								<button
									onClick={() => openEdit(staff)}
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<Icon icon="ph:pencil-simple-bold" width="20" />
								</button>
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
				{staffList.length === 0 && (
					<div className="text-muted-foreground rounded-[16px] border border-dashed p-8 text-center">
						No staff members added for this vendor yet.
					</div>
				)}
			</div>

			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Staff</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
						<Input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
						<Input placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} />
						<Input placeholder="Role" value={formData.role} onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))} />
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
						<Button onClick={handleCreate} disabled={createMutation.isPending} className="bg-secondary text-white hover:bg-secondary/90">
							{createMutation.isPending ? "Saving..." : "Add Staff"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Staff</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
						<Input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
						<Input placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} />
						<Input placeholder="Role" value={formData.role} onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))} />
						<Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as "Active" | "Inactive" }))}>
							<SelectTrigger>
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Active">Active</SelectItem>
								<SelectItem value="Inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
						<Button onClick={handleUpdate} disabled={updateMutation.isPending} className="bg-secondary text-white hover:bg-secondary/90">
							{updateMutation.isPending ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ConfirmDeleteModal 
				isOpen={isDeleteOpen} 
				onOpenChange={setIsDeleteOpen} 
				onConfirm={handleConfirmDelete}
				isLoading={deleteMutation.isPending}
				title="Remove Staff?"
				description={`Are you sure you want to remove ${selectedStaff?.name} from the staff list?`}
			/>
		</div>
	);
}

/* eslint-enable */
