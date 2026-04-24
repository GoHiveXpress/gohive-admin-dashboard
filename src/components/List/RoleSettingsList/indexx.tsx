import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	getRoleSettingsColumns,
	type RoleSettingsData,
} from "@/components/Tables/columns/RoleSettingsColumns";
import { useAdmins, useInvitations, useDeleteAdmin, useAdminProfile } from "@/hooks/userManagement";
import AddNewAdminModal from "@/components/_modals/AddNewAdminModal";
import ConfirmDeleteModal from "@/components/_modals/ConfirmDelete";

export default function RoleSettingsList() {
	const { data: adminsResponse, isLoading: isLoadingAdmins } = useAdmins();
	const { data: invitationsResponse, isLoading: isLoadingInvites } = useInvitations();
	const { data: profileResponse } = useAdminProfile();
	const deleteAdminMutation = useDeleteAdmin();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [idToDelete, setIdToDelete] = useState<string | null>(null);

	const currentUserRole = profileResponse?.data?.role || "";

	const handleActionDelete = (id: string) => {
		setIdToDelete(id);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = () => {
		if (idToDelete) {
			deleteAdminMutation.mutate(idToDelete, {
				onSuccess: () => {
					setIsDeleteOpen(false);
					setIdToDelete(null);
				},
			});
		}
	};

	const adminData: RoleSettingsData[] = useMemo(() => {
		const result: RoleSettingsData[] = [];

		// Add Admins
		if (adminsResponse?.data) {
			adminsResponse.data.forEach((admin: any) => {
				result.push({
					id: admin._id,
					name: admin.name,
					adminId: admin._id.slice(-8).toUpperCase(),
					status: (admin.accountStatus as any) || "Active",
					phone: admin.phone || "N/A",
					role: admin.role,
					profilePicture: admin.profilePicture,
					isInvitation: false,
				});
			});
		}

		// Add Invitations
		if (invitationsResponse?.data) {
			invitationsResponse.data.forEach((invite: any) => {
				result.push({
					id: invite._id,
					name: invite.email,
					adminId: "N/A",
					status: invite.status,
					phone: "N/A",
					role: invite.role,
					email: invite.email,
					isInvitation: true,
				});
			});
		}

		return result.sort((a, b) => {
			// Pending first, then by name
			if (a.status === "pending" && b.status !== "pending") return -1;
			if (a.status !== "pending" && b.status === "pending") return 1;
			return a.name.localeCompare(b.name);
		});
	}, [adminsResponse, invitationsResponse]);

	const filteredData = useMemo(() => {
		return adminData.filter(
			(admin) =>
				admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				admin.email?.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [adminData, searchQuery]);

	if (isLoadingAdmins || isLoadingInvites) {
		return <div className="flex h-64 items-center justify-center">Loading Role Data...</div>;
	}

	return (
		<div className="space-y-6">
			{/* Controls */}
			<div className="flex flex-wrap items-center gap-4">
				<Button
					onClick={() => setIsModalOpen(true)}
					className="bg-secondary hover:bg-secondary/90 h-10 gap-2 rounded-lg px-4 text-white"
				>
					<Icon icon="lucide:plus-circle" className="size-5" />
					Add New Staff
				</Button>

				<div className="flex-1" />

				<div className="relative w-full sm:w-[250px]">
					<Icon
						icon="lucide:search"
						className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
					/>
					<Input
						placeholder="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="border-border h-10 rounded-lg bg-white pl-9"
					/>
				</div>

				<Button
					variant="outline"
					size="icon"
					className="border-border size-10 rounded-lg bg-white"
				>
					<Icon icon="lucide:sliders-horizontal" className="size-4" />
				</Button>

				<Button className="bg-accent hover:bg-accent/90 h-10 rounded-lg px-6 text-white">
					All
				</Button>

				<Button
					variant="outline"
					className="border-border h-10 rounded-lg bg-white px-4 text-sm font-medium"
				>
					A-Z
				</Button>

				<Button
					variant="outline"
					className="border-border flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium"
				>
					Status <Icon icon="lucide:chevron-down" className="size-4" />
				</Button>
			</div>

			<div className="border-border overflow-hidden rounded-[20px] border bg-white p-0 shadow-sm">
				<DataTable 
					columns={getColumns(getRoleSettingsColumns(handleActionDelete, currentUserRole))} 
					data={filteredData} 
				/>
			</div>

			<AddNewAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

			<ConfirmDeleteModal 
				isOpen={isDeleteOpen} 
				onOpenChange={setIsDeleteOpen} 
				onConfirm={handleConfirmDelete} 
				isLoading={deleteAdminMutation.isPending}
				title="Delete Admin Account?"
				description="Are you sure you want to permanently delete this admin account? This action cannot be undone."
			/>
		</div>
	);
}
