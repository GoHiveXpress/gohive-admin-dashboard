// src/components/Sidebar/index.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner"; // Import sonner
import { clearAuth } from "@/utils/auth"; // Import your existing auth util
import { MENU_ITEMS, BOTTOM_MENU_ITEMS, LOGOUT_ITEM } from "@/constants/SidebarMenuItems";
import { cn } from "@/lib/utils";

export default function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();
	const router = useRouter();

	// Temporary Logout Logic
	const handleLogout = () => {
		// 1. Clear local storage token (using your existing util)
		clearAuth();
		
		// 2. Show Success Toast
		toast.success("Logged out successfully");

		// 3. Redirect to root/login page
		router.push("/");
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

			isLogout &&
				"text-destructive hover:bg-destructive/10 hover:text-destructive mt-4",

			className,
		);

		// If it's the logout item, render a Button with onClick handler
		if (isLogout) {
			return (
				<button onClick={handleLogout} className={commonClasses}>
					<item.icon
						className={cn(
							"h-5 w-5",
							"text-destructive",
						)}
					/>
					<span>{item.label}</span>
				</button>
			);
		}

		// Otherwise, render a standard Next.js Link
		return (
			<Link
				href={item.href}
				className={commonClasses}
			>
				<item.icon
					className={cn(
						"h-5 w-5",
						isActive ? "text-primary" : "text-currentColor",
					)}
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
			<div className="h-20 flex items-center px-6 border-b border-border">
				<div className="relative w-24 h-24">
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

			<div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-none">
				{MENU_ITEMS.map((item) => (
					<NavItem key={item.href} item={item} />
				))}

				<div className="pt-6 mt-6 border-t border-border">
					<p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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