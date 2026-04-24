// src/components/Navbar/index.tsx

"use client";

import { Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/Sidebar";
import NotificationPopover from "@/components/Notifications/NotificationPopover";
import { useAdminProfile } from "@/hooks/userManagement";

export default function Navbar() {
	const { data: profileData } = useAdminProfile();
	const user = profileData?.data;

	const getInitials = (name: string) => {
		if (!name) return "AD";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	const formatRole = (role: string) => {
		if (!role) return "";
		if (role === "superadmin") return "Super Admin";
		return role.charAt(0).toUpperCase() + role.slice(1);
	};

	return (
		<header className="bg-background border-border sticky top-0 z-40 flex h-20 items-center justify-between border-b px-4 lg:px-8">
			<div className="flex items-center gap-4">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="lg:hidden">
							<Menu className="text-foreground size-6" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="border-border w-[280px] border-r p-0">
						<Sidebar className="flex w-full border-none" />
					</SheetContent>
				</Sheet>

				<div className="flex flex-col">
					<h1 className="text-foreground text-lg font-bold leading-tight lg:text-xl">
						{user?.name || "Admin"}
					</h1>
					<p className="text-muted-foreground text-xs font-medium">
						{formatRole(user?.role || "")}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3 lg:gap-6">
				<Button
					variant="ghost"
					size="icon"
					className="border-border hover:bg-muted size-10 rounded-full border"
				>
					<Search className="text-muted-foreground size-5" />
				</Button>

				<NotificationPopover />

				<div className="flex items-center gap-3 border-l pl-3 lg:pl-6">
					<div className="hidden flex-col items-end lg:flex">
						<span className="text-foreground text-sm font-semibold">{user?.name}</span>
						<span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
							{formatRole(user?.role || "")}
						</span>
					</div>

					<div className="relative">
						<Avatar className="border-border size-10 border">
							{user?.profilePicture && (
								<AvatarImage src={user.profilePicture} alt={user.name} />
							)}
							<AvatarFallback className="bg-primary/10 text-primary font-bold">
								{getInitials(user?.name || "Admin")}
							</AvatarFallback>
						</Avatar>

						<span className="bg-secondary border-background absolute bottom-0 right-0 size-3 rounded-full border-2" />
					</div>
				</div>
			</div>
		</header>
	);
}
