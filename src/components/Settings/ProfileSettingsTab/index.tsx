"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/control-has-associated-label */

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

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
	const [notifications, setNotifications] = useState({ push: true, sms: true, email: true });

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
								src="https://i.pravatar.cc/150?u=1"
								alt="Profile"
								className="size-full object-cover"
							/>
						</div>
						<button className="bg-secondary absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full border-2 border-white text-white">
							<Icon icon="lucide:pencil" className="size-3" />
						</button>
					</div>
					<div>
						<h2 className="text-xl font-semibold">Victor Kenny</h2>
						<div className="mt-1 flex items-center gap-2">
							<span className="text-muted-foreground text-xs">Admin ID Number:</span>
							<span className="border-border bg-muted/20 rounded border px-2 py-0.5 text-xs">
								AGHV0923
							</span>
						</div>
					</div>
				</div>

				{/* Form */}
				<div className="space-y-5">
					<div className="space-y-2">
						<label className="text-muted-foreground text-sm">First Name</label>
						<Input
							defaultValue="Victor"
							className="border-border h-12 rounded-xl bg-white"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-muted-foreground text-sm">Last Name</label>
						<Input
							defaultValue="Kenny"
							className="border-border h-12 rounded-xl bg-white"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-muted-foreground text-sm">Email</label>
						<Input
							defaultValue="designbyprose@gmail.com"
							className="border-border h-12 rounded-xl bg-white"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-muted-foreground text-sm">Role</label>
						<div className="relative">
							<Input
								defaultValue="Customer Support"
								disabled
								className="border-border bg-muted/20 text-muted-foreground h-12 rounded-xl"
							/>
							<Icon
								icon="lucide:lock"
								className="text-muted-foreground/50 absolute right-4 top-1/2 size-4 -translate-y-1/2"
							/>
						</div>
					</div>

					<Button className="bg-secondary hover:bg-secondary/90 mt-4 h-12 w-full rounded-xl text-base font-medium text-white">
						Save Changes
					</Button>
				</div>
			</div>

			{/* === Right: Notification & Security === */}
			<div className="border-border h-full space-y-10 rounded-[24px] border bg-white p-8 shadow-sm">
				{/* Notifications */}
				<div className="space-y-6">
					<h3 className="text-foreground/80 text-xl font-medium">
						Notification Preference
					</h3>
					<div className="space-y-4">
						<div className="border-border flex items-center justify-between rounded-xl border p-4">
							<span className="text-sm font-medium">Push</span>
							<Switch
								checked={notifications.push}
								onCheckedChange={(v) =>
									setNotifications((p) => ({ ...p, push: v }))
								}
							/>
						</div>
						<div className="border-border flex items-center justify-between rounded-xl border p-4">
							<span className="text-sm font-medium">SMS</span>
							<Switch
								checked={notifications.sms}
								onCheckedChange={(v) => setNotifications((p) => ({ ...p, sms: v }))}
							/>
						</div>
						<div className="border-border flex items-center justify-between rounded-xl border p-4">
							<span className="text-sm font-medium">Email Alert</span>
							<Switch
								checked={notifications.email}
								onCheckedChange={(v) =>
									setNotifications((p) => ({ ...p, email: v }))
								}
							/>
						</div>
					</div>
				</div>

				{/* Security */}
				<div className="space-y-6">
					<h3 className="text-foreground/80 text-xl font-medium">Security Settings</h3>
					<div className="space-y-4">
						<Button
							variant="outline"
							className="border-border bg-muted/20 hover:bg-muted/30 text-foreground h-14 w-full justify-center gap-3 rounded-xl font-medium"
						>
							<Icon icon="lucide:lock" className="size-5" /> Change Password
						</Button>
						<Button className="bg-secondary hover:bg-secondary/90 h-14 w-full justify-center gap-3 rounded-xl font-medium text-white">
							<Icon icon="lucide:shield-check" className="size-5" /> Set Two-factor
							Auth
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
