"use client";

/* eslint-disable no-nested-ternary, no-use-before-define */

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RoleActionCell from "@/components/Tables/cells/RoleActionCell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/* --- New Sub-Component for Role Selection Cell --- */
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
	useUpdateAdminPermissions,
	useResendInvitation,
	useCancelInvitation,
} from "@/hooks/userManagement";
import { type BaseColumnSchema } from "../types";

export type RoleSettingsData = {
	id: string;
	name: string;
	adminId: string;
	status: "Active" | "Suspend" | "Inactive" | "pending" | "accepted" | "expired" | "cancelled";
	phone: string;
	role: string;
	email?: string; // For invitations
	isInvitation?: boolean;
	profilePicture?: string;
};

export const getRoleSettingsColumns = (
	onDelete: (id: string) => void,
	currentUserRole: string,
	currentUserId: string,
): BaseColumnSchema<RoleSettingsData>[] => [
	{
		key: "name",
		header: "Name",
		render: (row) => (
			<div className="flex items-center gap-3">
				<div className="relative">
					<Avatar className="size-10 border border-gray-100">
						<AvatarImage
							src={
								row.isInvitation
									? `https://ui-avatars.com/api/?name=${row.email}&background=random`
									: row.profilePicture
							}
							alt={row.name}
							className="object-cover"
						/>
						<AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
							{row.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.slice(0, 2)}
						</AvatarFallback>
					</Avatar>
					{/* Status Dot on Avatar */}
					<span
						className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${
							row.status === "Active"
								? "bg-secondary"
								: row.status === "Suspend"
									? "bg-destructive"
									: row.status === "pending"
										? "bg-blue-400"
										: "bg-orange-400"
						}`}
					/>
				</div>
				<div className="flex flex-col">
					<span className="text-foreground text-sm font-semibold">
						{row.isInvitation ? row.email : row.name}
					</span>
					<div className="flex items-center gap-1">
						<span className="text-muted-foreground text-[10px]">Staff ID Number:</span>
						<span className="border-border bg-muted/20 rounded border px-1.5 py-0.5 text-[10px]">
							{row.adminId}
						</span>
					</div>
				</div>
			</div>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row) => {
			let badgeClass = "";
			let iconClass = "";
			const text = row.status;

			if (row.status === "Active" || row.status === "accepted") {
				badgeClass = "bg-secondary/10 text-secondary";
				iconClass = "text-secondary";
			} else if (row.status === "Suspend" || row.status === "cancelled") {
				badgeClass = "bg-destructive/10 text-destructive";
				iconClass = "text-destructive";
			} else if (row.status === "pending") {
				badgeClass = "bg-blue-100 text-blue-600";
				iconClass = "text-blue-600";
			} else {
				badgeClass = "bg-orange-100 text-orange-500";
				iconClass = "text-orange-500";
			}

			return (
				<Badge
					className={`rounded-full border-none px-3 py-1 font-medium shadow-none ${badgeClass} hover:${badgeClass}`}
				>
					<Icon icon="ph:circle-fill" className={`mr-2 size-2 ${iconClass}`} />
					{text.charAt(0).toUpperCase() + text.slice(1)}
				</Badge>
			);
		},
	},
	{
		key: "phone",
		header: "Phone",
		render: (row) => <span className="text-foreground text-sm font-medium">{row.phone}</span>,
	},
	{
		key: "role",
		header: "Role",
		render: (row) => (
			<RoleCell
				row={row}
				// Only superadmins change roles, and never their own (the server refuses it too)
				canEdit={currentUserRole === "superadmin" && row.id !== currentUserId}
			/>
		),
	},
	{
		key: "action",
		header: "",
		render: (row) => (
			<ActionCell
				row={row}
				onDelete={onDelete}
				currentUserRole={currentUserRole}
				isSelf={row.id === currentUserId}
			/>
		),
	},
];

const roleLabel = (role: string) => (role === "superadmin" ? "Super Admin" : "Staff");

const RoleCell = ({ row, canEdit }: { row: RoleSettingsData; canEdit: boolean }) => {
	// Same endpoint as the permissions modal, so the server applies one set of rules
	const updateRole = useUpdateAdminPermissions();
	// Shown while the change is saving; afterwards the refetched row is the source of truth,
	// so a refused change falls back to the real role instead of sticking on screen
	const [pendingRole, setPendingRole] = useState<string | null>(null);

	if (row.isInvitation === true || !canEdit) {
		return (
			<div className="text-secondary inline-flex h-9 w-40 items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium">
				{roleLabel(row.role)}
			</div>
		);
	}

	const handleRoleUpdate = (newRole: string) => {
		if (newRole === row.role) return;
		setPendingRole(newRole);
		updateRole.mutate(
			{ id: row.id, data: { role: newRole as "superadmin" | "staff" } },
			{ onSettled: () => setPendingRole(null) },
		);
	};

	return (
		<Select
			value={pendingRole ?? row.role}
			onValueChange={handleRoleUpdate}
			disabled={updateRole.isPending}
		>
			<SelectTrigger className="text-secondary inline-flex h-9 w-40 items-center justify-between gap-2 rounded-lg border-none bg-green-50 px-3 py-1.5 text-sm font-medium shadow-none focus:ring-0">
				<SelectValue placeholder="Select Role" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="superadmin">Super Admin</SelectItem>
				<SelectItem value="staff">Staff</SelectItem>
			</SelectContent>
		</Select>
	);
};

const ActionCell = ({
	row,
	onDelete,
	currentUserRole,
	isSelf,
}: {
	row: RoleSettingsData;
	onDelete: (id: string) => void;
	currentUserRole: string;
	isSelf: boolean;
}) => {
	const resendMutation = useResendInvitation();
	const cancelMutation = useCancelInvitation();

	if (row.isInvitation && row.status === "pending") {
		return (
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => resendMutation.mutate(row.email!)}
					disabled={resendMutation.isPending}
					className="text-blue-600 hover:bg-blue-50"
				>
					<Icon icon="lucide:rotate-cw" className="mr-1 size-4" />
					Resend
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => cancelMutation.mutate(row.email!)}
					disabled={cancelMutation.isPending}
					className="text-destructive hover:bg-red-50"
				>
					<Icon icon="lucide:x-circle" className="mr-1 size-4" />
					Cancel
				</Button>
			</div>
		);
	}

	if (row.isInvitation && row.status === "cancelled") {
		return (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => resendMutation.mutate(row.email!)}
				disabled={resendMutation.isPending}
				className="text-blue-600 hover:bg-blue-50"
			>
				<Icon icon="lucide:rotate-cw" className="mr-1 size-4" />
				Restart
			</Button>
		);
	}

	// Only SuperAdmins can delete other admins, and nobody deletes themselves
	// from this table (the backend refuses it anyway).
	if (currentUserRole !== "superadmin" || isSelf) {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			<RoleActionCell
				row={{
					id: row.id,
					name: row.name,
					adminId: row.adminId,
					role: row.role,
				}}
			/>
			<Button
				variant="ghost"
				size="icon"
				className="size-9 rounded-full bg-red-50 hover:bg-red-100"
				onClick={() => onDelete(row.id)}
			>
				<Icon icon="lucide:trash-2" className="text-destructive size-5" />
			</Button>
		</div>
	);
};

/* eslint-enable */
