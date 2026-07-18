"use client";

/* eslint-disable @next/next/no-img-element, import/no-extraneous-dependencies, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Separator } from "@/components/ui/separator";
import { useAdminPermissions, useUpdateAdminPermissions } from "@/hooks/userManagement";
import { useToast } from "@/hooks/useToast";

interface SettingsActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	userData: {
		id: string;
		name: string;
		adminId: string;
		role: string;
	};
}

const PERMISSIONS_LEFT = [
	"Customer Management",
	"Vendor Management",
	"Rider Management",
	"Edit",
	"Messaging",
];

const PERMISSIONS_RIGHT = [
	"Finance",
	"Customer Support",
	"Broadcast",
	"Analytics & Reports",
	"Download",
];

export default function SettingsActionModal({
	isOpen,
	onClose,
	userData,
}: SettingsActionModalProps) {
	const { data: permissionsResponse, isLoading } = useAdminPermissions(userData.id, isOpen);
	const updatePermissionsMutation = useUpdateAdminPermissions();
	const toast = useToast();

	const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
		const defaults = [...PERMISSIONS_LEFT, ...PERMISSIONS_RIGHT].reduce<Record<string, boolean>>(
			(acc, key) => {
				acc[key] = false;
				return acc;
			},
			{},
		);
		return defaults;
	});
	const [role, setRole] = useState<"superadmin" | "staff">(
		userData.role === "superadmin" ? "superadmin" : "staff",
	);

	const accountStatus = permissionsResponse?.data?.accountStatus || "Active";

	React.useEffect(() => {
		if (!permissionsResponse?.data) return;

		const enabledPermissions = new Set(permissionsResponse.data.permissions || []);
		const nextState = [...PERMISSIONS_LEFT, ...PERMISSIONS_RIGHT].reduce<Record<string, boolean>>(
			(acc, key) => {
				acc[key] = enabledPermissions.has(key);
				return acc;
			},
			{},
		);

		setPermissions(nextState);
		setRole(permissionsResponse.data.role === "superadmin" ? "superadmin" : "staff");
	}, [permissionsResponse]);

	const togglePermission = (key: string) => {
		setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSuspendToggle = async () => {
		const nextStatus = accountStatus === "Suspend" ? "Active" : "Suspend";
		await updatePermissionsMutation.mutateAsync({
			id: userData.id,
			data: { accountStatus: nextStatus },
		});
	};

	const handleApplyChanges = async () => {
		const selectedPermissions = Object.entries(permissions)
			.filter(([, enabled]) => enabled)
			.map(([key]) => key);

		await updatePermissionsMutation.mutateAsync({
			id: userData.id,
			data: {
				permissions: selectedPermissions,
				role,
			},
		});

		toast.success("Permissions updated");
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="gap-0 rounded-[24px] border-none bg-white p-8 shadow-xl sm:max-w-[700px] [&>button]:hidden">
				<VisuallyHidden>
					<DialogTitle>Permissions matrix</DialogTitle>
				</VisuallyHidden>

				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<h2 className="text-foreground text-xl font-medium">Permissions matrix</h2>
					<DialogClose asChild>
						<Button
							variant="ghost"
							size="icon"
							className="bg-muted/20 hover:bg-muted/40 size-9 rounded-full"
						>
							<Icon icon="ph:x" className="text-foreground size-4" />
						</Button>
					</DialogClose>
				</div>

				{/* User Info & Suspend Button */}
				<div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div className="flex items-center gap-4">
						<div className="relative">
							<div className="size-14 overflow-hidden rounded-full bg-gray-200">
								<img
									src={`https://i.pravatar.cc/150?u=${userData.id}`}
									alt={userData.name}
									className="size-full object-cover"
								/>
							</div>
							<span className="bg-secondary absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white" />
						</div>
						<div>
							<h3 className="text-foreground text-lg font-semibold">
								{userData.name}
							</h3>
							<div className="mt-0.5 flex items-center gap-2">
								<span className="text-muted-foreground text-xs">
									Admin ID Number:
								</span>
								<span className="border-border bg-muted/20 rounded border px-2 py-0.5 text-xs">
									{userData.adminId}
								</span>
							</div>
						</div>
					</div>

					<Button
						variant="ghost"
						onClick={handleSuspendToggle}
						disabled={updatePermissionsMutation.isPending}
						className="text-destructive h-10 gap-2 rounded-full bg-red-50 px-6 font-medium hover:bg-red-100"
					>
						<Icon icon="ph:minus-circle-fill" className="size-5" />
						{accountStatus === "Suspend" ? "Reactivate Account" : "Suspend Account"}
					</Button>
				</div>

				{/* Role Selector */}
				<div className="mb-8 flex items-center gap-4">
					<span className="text-foreground text-base font-medium">Role</span>
					<Select value={role} onValueChange={(value) => setRole(value as "superadmin" | "staff")}>
						<SelectTrigger className="border-border h-11 w-[200px] rounded-xl bg-white text-base">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="staff">Staff</SelectItem>
							<SelectItem value="superadmin">Super Admin</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Separator className="bg-border mb-8" />

				{/* Permissions Grid */}
				<div className="mb-10 flex flex-col gap-8 md:flex-row md:gap-16">
					{isLoading ? (
						<div className="text-muted-foreground py-10 text-center">Loading permissions...</div>
					) : (
						<>
					{/* Left Column */}
					<div className="flex-1 space-y-6">
						{PERMISSIONS_LEFT.map((perm) => (
							<div key={perm} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<span className="bg-secondary size-2 rounded-full" />
									<label
										className="text-foreground/80 cursor-pointer text-base font-medium"
										onClick={() => togglePermission(perm)}
									>
										{perm}
									</label>
								</div>
								<Checkbox
									checked={permissions[perm]}
									onCheckedChange={() => togglePermission(perm)}
									className="border-border data-[state=checked]:bg-secondary data-[state=checked]:border-secondary size-6 rounded data-[state=checked]:text-white"
								/>
							</div>
						))}
					</div>

					{/* Vertical Separator (Only on md screens and up) */}
					<div className="bg-border hidden w-px self-stretch md:block" />

					{/* Right Column */}
					<div className="flex-1 space-y-6">
						{PERMISSIONS_RIGHT.map((perm) => (
							<div key={perm} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<span className="bg-secondary size-2 rounded-full" />
									<label
										className="text-foreground/80 cursor-pointer text-base font-medium"
										onClick={() => togglePermission(perm)}
									>
										{perm}
									</label>
								</div>
								<Checkbox
									checked={permissions[perm]}
									onCheckedChange={() => togglePermission(perm)}
									className="border-border data-[state=checked]:bg-secondary data-[state=checked]:border-secondary size-6 rounded data-[state=checked]:text-white"
								/>
							</div>
						))}
					</div>
						</>
					)}
				</div>

				{/* Footer Button */}
				<div className="flex justify-center">
					<Button
						onClick={handleApplyChanges}
						disabled={updatePermissionsMutation.isPending}
						className="bg-secondary hover:bg-secondary/90 h-12 w-[300px] rounded-lg text-lg font-medium text-white"
					>
						{updatePermissionsMutation.isPending ? "Applying..." : "Apply Changes"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/* eslint-enable */
