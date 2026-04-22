/* eslint-disable @next/next/no-img-element, jsx-a11y/control-has-associated-label */

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
	useAdminProfile,
	useUpdateAdminProfile,
	useChangePassword,
} from "@/hooks/userManagement";
import { useToast } from "@/hooks/useToast";

// Simple Switch Component for this view
const Switch = ({
	checked,
	onCheckedChange,
}: {
	checked: boolean;
	onCheckedChange: (v: boolean) => void;
}) => (
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		onClick={() => onCheckedChange(!checked)}
		className={cn(
			"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			checked ? "bg-secondary" : "bg-input",
		)}
	>
		<span
			className={cn(
				"pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out",
				checked ? "translate-x-5" : "translate-x-0",
			)}
		/>
	</button>
);

export default function ProfileSettingsTab() {
	const { data: profileResponse, isLoading } = useAdminProfile();
	const updateProfileMutation = useUpdateAdminProfile();
	const changePasswordMutation = useChangePassword();
	const toast = useToast();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		profilePicture: "",
	});

	const [passwordData, setPasswordData] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const [showPasswordForm, setShowPasswordForm] = useState(false);

	useEffect(() => {
		if (profileResponse?.data) {
			const admin = profileResponse.data;
			const nameParts = admin.name.split(" ");
			setFormData({
				firstName: nameParts[0] || "",
				lastName: nameParts.slice(1).join(" ") || "",
				email: admin.email || "",
				phone: admin.phone || "",
				profilePicture: admin.profilePicture || "",
			});
		}
	}, [profileResponse]);

	const handleSaveChanges = () => {
		updateProfileMutation.mutate({
			name: `${formData.firstName} ${formData.lastName}`.trim(),
			email: formData.email,
			phone: formData.phone,
			profilePicture: formData.profilePicture,
		});
	};

	const handlePasswordChange = () => {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		if (passwordData.newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		changePasswordMutation.mutate(
			{ newPassword: passwordData.newPassword },
			{
				onSuccess: () => {
					setShowPasswordForm(false);
					setPasswordData({ newPassword: "", confirmPassword: "" });
				},
			},
		);
	};

	if (isLoading) {
		return <div className="flex h-64 items-center justify-center">Loading Profile...</div>;
	}

	const admin = profileResponse?.data;

	return (
		<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
			{/* === Left: Personal Information === */}
			<div className="border-border space-y-8 rounded-[24px] border bg-white p-8 shadow-sm">
				<h3 className="text-foreground/80 text-xl font-medium">Personal Information</h3>

				{/* Avatar */}
				<div className="flex items-center gap-4">
					<div className="relative">
						<div className="size-20 overflow-hidden rounded-full bg-gray-200">
							<img
								src={formData.profilePicture || "https://ui-avatars.com/api/?name=" + (admin?.name || "User")}
								alt="Profile"
								className="size-full object-cover"
							/>
						</div>
						<label
							htmlFor="profile-pic-upload"
							className="bg-secondary absolute bottom-0 right-0 flex size-6 cursor-pointer items-center justify-center rounded-full border-2 border-white text-white"
						>
							<Icon icon="lucide:pencil" className="size-3" />
							<input
								id="profile-pic-upload"
								type="file"
								className="hidden"
								accept="image/*"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										// For now, we'll use a local preview or a placeholder URL logic
										// In a real app, you'd upload this file first
										const reader = new FileReader();
										reader.onloadend = () => {
											setFormData((prev) => ({
												...prev,
												profilePicture: reader.result as string,
											}));
										};
										reader.readAsDataURL(file);
									}
								}}
							/>
						</label>
					</div>
					<div>
						<h2 className="text-xl font-semibold">{admin?.name || "Admin User"}</h2>
						<div className="mt-1 flex items-center gap-2">
							<span className="text-muted-foreground text-xs">Admin ID Number:</span>
							<span className="border-border bg-muted/20 rounded border px-2 py-0.5 text-xs">
								{admin?._id.slice(-8).toUpperCase() || "N/A"}
							</span>
						</div>
					</div>
				</div>

				{/* Form */}
				<div className="space-y-5">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm">First Name</label>
							<Input
								value={formData.firstName}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, firstName: e.target.value }))
								}
								className="border-border h-12 rounded-xl bg-white"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm">Last Name</label>
							<Input
								value={formData.lastName}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, lastName: e.target.value }))
								}
								className="border-border h-12 rounded-xl bg-white"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<label className="text-muted-foreground text-sm">Email</label>
						<div className="relative">
							<Input
								value={formData.email}
								disabled
								className="border-border bg-muted/20 text-muted-foreground h-12 rounded-xl"
							/>
							<Icon
								icon="lucide:lock"
								className="text-muted-foreground/50 absolute right-4 top-1/2 size-4 -translate-y-1/2"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<label className="text-muted-foreground text-sm">Role</label>
						<div className="relative">
							<Input
								value={admin?.role || "Staff"}
								disabled
								className="border-border bg-muted/20 text-muted-foreground h-12 rounded-xl"
							/>
							<Icon
								icon="lucide:lock"
								className="text-muted-foreground/50 absolute right-4 top-1/2 size-4 -translate-y-1/2"
							/>
						</div>
					</div>

					<Button
						onClick={handleSaveChanges}
						disabled={updateProfileMutation.isPending}
						className="bg-secondary hover:bg-secondary/90 mt-4 h-12 w-full rounded-xl text-base font-medium text-white"
					>
						{updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</div>

			{/* === Right: Notification & Security === */}
			<div className="border-border h-full space-y-10 rounded-[24px] border bg-white p-8 shadow-sm">
				{/* Notifications section hidden as per request */}
				{/* 
				<div className="space-y-6">
					<h3 className="text-foreground/80 text-xl font-medium">Notification Preference</h3>
					...
				</div> 
				*/}

				{/* Security */}
				<div className="space-y-6">
					<h3 className="text-foreground/80 text-xl font-medium">Security Settings</h3>
					<div className="space-y-4">
						{!showPasswordForm ? (
							<Button
								variant="outline"
								onClick={() => setShowPasswordForm(true)}
								className="border-border bg-muted/20 hover:bg-muted/30 text-foreground h-14 w-full justify-center gap-3 rounded-xl font-medium"
							>
								<Icon icon="lucide:lock" className="size-5" /> Change Password
							</Button>
						) : (
							<div className="space-y-4 rounded-xl border border-dashed p-4">
								<div className="space-y-2">
									<label className="text-xs font-medium uppercase text-gray-500">
										New Password
									</label>
									<Input
										type="password"
										value={passwordData.newPassword}
										onChange={(e) =>
											setPasswordData((prev) => ({
												...prev,
												newPassword: e.target.value,
											}))
										}
										className="h-12"
										placeholder="••••••••"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium uppercase text-gray-500">
										Confirm New Password
									</label>
									<Input
										type="password"
										value={passwordData.confirmPassword}
										onChange={(e) =>
											setPasswordData((prev) => ({
												...prev,
												confirmPassword: e.target.value,
											}))
										}
										className="h-12"
										placeholder="••••••••"
									/>
								</div>
								<div className="flex gap-2">
									<Button
										variant="ghost"
										onClick={() => setShowPasswordForm(false)}
										className="flex-1"
									>
										Cancel
									</Button>
									<Button
										onClick={handlePasswordChange}
										disabled={changePasswordMutation.isPending}
										className="bg-secondary flex-1 text-white"
									>
										{changePasswordMutation.isPending
											? "Updating..."
											: "Update Password"}
									</Button>
								</div>
							</div>
						)}
						<Button className="bg-secondary/10 text-secondary hover:bg-secondary/20 h-14 w-full justify-center gap-3 rounded-xl font-medium">
							<Icon icon="lucide:shield-check" className="size-5" /> Two-factor Auth (Coming Soon)
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
