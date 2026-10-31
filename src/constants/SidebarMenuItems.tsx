// src/constants/SidebarMenuItems.tsx
import {
	BarChart3,
	Bike,
	ClipboardList,
	LayoutDashboard,
	LogOut,
	MessageSquare,
	Settings,
	ShieldCheck,
	Store,
	UsersRound,
	Wallet,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { PAGE_TITLES } from "@/constants/pageMeta";

export const MENU_ITEMS = [
	{ label: PAGE_TITLES[ROUTES.DASHBOARD], icon: LayoutDashboard, href: ROUTES.DASHBOARD },
	{ label: PAGE_TITLES[ROUTES.CUSTOMERS], icon: UsersRound, href: ROUTES.CUSTOMERS },
	{ label: PAGE_TITLES[ROUTES.VENDORS], icon: Store, href: ROUTES.VENDORS },
	{ label: PAGE_TITLES[ROUTES.RIDERS], icon: Bike, href: ROUTES.RIDERS },
	{ label: PAGE_TITLES[ROUTES.ORDERS], icon: ClipboardList, href: ROUTES.ORDERS },
	{ label: PAGE_TITLES[ROUTES.SUPPORT], icon: MessageSquare, href: ROUTES.SUPPORT },
	{ label: PAGE_TITLES[ROUTES.FINANCE], icon: Wallet, href: ROUTES.FINANCE },
	{ label: PAGE_TITLES[ROUTES.ANALYTICS], icon: BarChart3, href: ROUTES.ANALYTICS },
	{ label: PAGE_TITLES[ROUTES.USERS], icon: ShieldCheck, href: ROUTES.USERS },
];

export const BOTTOM_MENU_ITEMS = [
	{ label: PAGE_TITLES[ROUTES.SETTINGS], icon: Settings, href: ROUTES.SETTINGS },
];

export const LOGOUT_ITEM = {
	label: "Sign out",
	icon: LogOut,
	href: ROUTES.LOGOUT,
};
