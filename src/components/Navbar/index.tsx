// src/components/Navbar/index.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ChevronRight, LogOut, Menu, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/Sidebar";
import NotificationPopover from "@/components/Notifications/NotificationPopover";
import GlobalSearch from "@/components/GlobalSearch";
import { useAdminProfile } from "@/hooks/userManagement";
import { clearAuth } from "@/utils/auth";
import { pageCrumbs } from "@/constants/pageMeta";
import { ROUTES } from "@/constants/routes";

const getInitials = (name: string) => {
	if (!name) return "AD";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
};

const formatRole = (role: string) => {
	if (!role) return "";
	if (role === "superadmin") return "Super Admin";
	return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function Navbar() {
	const { data: profileData } = useAdminProfile();
	const user = profileData?.data;
	const pathname = usePathname();
	const crumbs = pageCrumbs(pathname);
	const title = crumbs.at(-1)?.label ?? "GoHive Admin";

	// The mobile menu closes once a link takes the admin to another page
	const [menuOpen, setMenuOpen] = useState(false);
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	const handleSignOut = async () => {
		clearAuth();
		await signOut({ callbackUrl: "/", redirect: true });
	};

	return (
		<header className="bg-background border-border sticky top-0 z-40 flex h-20 items-center justify-between border-b px-4 lg:px-8">
			<div className="flex min-w-0 items-center gap-4">
				<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							aria-label="Open menu"
						>
							<Menu className="text-foreground size-6" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="border-border w-[280px] border-r p-0">
						<SheetTitle className="sr-only">Menu</SheetTitle>
						<Sidebar className="flex w-full border-none" />
					</SheetContent>
				</Sheet>

				<div className="flex min-w-0 flex-col">
					{crumbs.length > 1 && (
						<nav aria-label="Breadcrumb">
							<ol className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
								{crumbs.slice(0, -1).map((crumb) => (
									<li key={crumb.label} className="flex items-center gap-1">
										{crumb.href ? (
											<Link
												href={crumb.href}
												className="hover:text-foreground"
											>
												{crumb.label}
											</Link>
										) : (
											crumb.label
										)}
										<ChevronRight className="size-3" aria-hidden />
									</li>
								))}
							</ol>
						</nav>
					)}
					<h1 className="text-foreground truncate text-lg font-bold leading-tight lg:text-xl">
						{title}
					</h1>
				</div>
			</div>

			<div className="flex items-center gap-3 lg:gap-6">
				<GlobalSearch />
				<NotificationPopover />

				<div className="border-l pl-3 lg:pl-6">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								aria-label="Account menu"
								className="focus-visible:ring-ring flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 lg:rounded-lg"
							>
								<div className="hidden flex-col items-end lg:flex">
									<span className="text-foreground text-sm font-semibold">
										{user?.name}
									</span>
									<span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
										{formatRole(user?.role ?? "")}
									</span>
								</div>
								<Avatar className="border-border size-10 border">
									{user?.profilePicture && (
										<AvatarImage src={user.profilePicture} alt="" />
									)}
									<AvatarFallback className="bg-primary/10 text-primary font-bold">
										{getInitials(user?.name ?? "Admin")}
									</AvatarFallback>
								</Avatar>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel className="flex flex-col">
								<span className="truncate">{user?.name ?? "Admin"}</span>
								<span className="text-muted-foreground truncate text-xs font-normal">
									{user?.email}
								</span>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href={`${ROUTES.SETTINGS}?tab=profile`}>
									<UserRound className="mr-2 size-4" />
									Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={ROUTES.SETTINGS}>
									<Settings className="mr-2 size-4" />
									Settings
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onSelect={() => {
									handleSignOut().catch(() => undefined);
								}}
							>
								<LogOut className="mr-2 size-4" />
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
