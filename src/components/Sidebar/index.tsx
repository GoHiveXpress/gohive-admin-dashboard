// src/components/Sidebar/index.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MENU_ITEMS, BOTTOM_MENU_ITEMS, LOGOUT_ITEM } from "@/constants/SidebarMenuItems";
import { cn } from "@/lib/utils";

export default function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();

	const NavItem = ({ item, isLogout = false }: { item: any; isLogout?: boolean }) => {
		const isActive = pathname === item.href;

		const isDashboard = item.href === "/dashboard";

		return (
			<Link
				href={item.href}
				className={cn(
					"flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",

					"text-muted-foreground hover:bg-muted hover:text-foreground",

					isActive && !isDashboard && "bg-muted text-foreground",

					isDashboard && "bg-muted text-primary",

					isLogout &&
						"text-destructive hover:bg-destructive/10 hover:text-destructive mt-4",
					className,
				)}
			>
				<item.icon
					className={cn(
						"h-5 w-5",

						isDashboard ? "text-primary" : "text-currentColor",
						isLogout && "text-destructive",
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
			{/* Logo Section */}
			<div className="h-20 flex items-center px-6 border-b border-border">
				<div className="relative w-24 h-24">
					<Image
						src="/assets/logo_gohive_dark.png"
						alt="GoHive"
						fill
						className="object-contain object-left"
						priority
					/>
				</div>
			</div>

			{/* Scrollable Menu Area */}
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
          		<NavItem item={LOGOUT_ITEM} isLogout />
				</div>
			</div>			
		</aside>
	);
}
