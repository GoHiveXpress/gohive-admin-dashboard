// src/components/Sidebar/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, react/no-unstable-nested-components */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner"; // Import sonner
import { signOut } from "next-auth/react";
import { clearAuth } from "@/utils/auth"; // Import your existing auth util
import { MENU_ITEMS, BOTTOM_MENU_ITEMS, LOGOUT_ITEM } from "@/constants/SidebarMenuItems";
import { cn } from "@/lib/utils";

export default function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();
	const router = useRouter();

	// Professional Logout Logic
	const handleLogout = async () => {
		// 1. Clear local storage token
		clearAuth();

		// 2. Perform NextAuth signOut (clears cookies and session)
		// Redirect to root/login but do it quietly
		await signOut({ 
			callbackUrl: "/",
			redirect: true 
		});
	};

	const NavItem = ({ item, isLogout = false }: { item: any; isLogout?: boolean }) => {
		const isActive =
			pathname === item.href ||
			(pathname.startsWith(item.href) && item.href !== "/dashboard");

		// Shared styles for both Link and Button
		const commonClasses = cn(
			"flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left", // Added w-full and text-left for button alignment

			"text-muted-foreground hover:bg-muted hover:text-foreground",

			isActive && !isLogout && "bg-muted text-primary",

			isLogout && "text-destructive hover:bg-destructive/10 hover:text-destructive mt-4",

			className,
		);

		// If it's the logout item, render a Button with onClick handler
		if (isLogout) {
			return (
				<button onClick={handleLogout} className={commonClasses}>
					<item.icon className={cn("h-5 w-5", "text-destructive")} />
					<span>{item.label}</span>
				</button>
			);
		}

		// Otherwise, render a standard Next.js Link
		return (
			<Link href={item.href} className={commonClasses}>
				<item.icon
					className={cn("h-5 w-5", isActive ? "text-primary" : "text-currentColor")}
				/>
				<span>{item.label}</span>
			</Link>
		);
	};

	return (
		<aside
			className={cn(
				"hidden lg:flex flex-col w-[280px] bg-background h-screen fixed left-0 top-0 border-r border-border",
				className,
			)}
		>
			<div className="border-border flex h-20 items-center border-b px-6">
				<div className="relative size-24">
					<Link href="/dashboard">
						<Image
							src="/assets/logo_gohive_dark.png"
							alt="GoHive"
							fill
							className="object-contain object-left"
							priority
						/>
					</Link>
				</div>
			</div>

			<div className="scrollbar-none flex-1 space-y-1 overflow-y-auto px-4 py-6">
				{MENU_ITEMS.map((item) => (
					<NavItem key={item.href} item={item} />
				))}

				<div className="border-border mt-6 border-t pt-6">
					<p className="text-muted-foreground mb-2 px-4 text-xs font-semibold uppercase tracking-wider">
						Other
					</p>
					{BOTTOM_MENU_ITEMS.map((item) => (
						<NavItem key={item.href} item={item} />
					))}

					{/* Logout Item */}
					<NavItem item={LOGOUT_ITEM} isLogout />
				</div>
			</div>
		</aside>
	);
}

/* eslint-enable */
