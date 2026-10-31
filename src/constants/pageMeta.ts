// src/constants/pageMeta.ts
// One name per screen, shared by the sidebar, the top bar and the browser tab.
import { ROUTES } from "@/constants/routes";

export const PAGE_TITLES: Record<string, string> = {
	[ROUTES.DASHBOARD]: "Dashboard",
	[ROUTES.ACTIVE_USERS]: "Active Users",
	[ROUTES.CUSTOMERS]: "Customers",
	[ROUTES.VENDORS]: "Vendors",
	[ROUTES.RIDERS]: "Riders",
	[ROUTES.ORDERS]: "Orders",
	[ROUTES.SUPPORT]: "Support",
	[ROUTES.FINANCE]: "Finance",
	[ROUTES.ANALYTICS]: "Reports",
	[ROUTES.USERS]: "Users",
	[ROUTES.SETTINGS]: "Settings",
};

export type PageCrumb = { label: string; href?: string };

// "/customer-management/abc" → [Customers (link), Details]
export function pageCrumbs(pathname: string): PageCrumb[] {
	const [section, ...rest] = pathname.split("/").filter(Boolean);
	const base = `/${section ?? ""}`;
	const title = PAGE_TITLES[base] ?? "GoHive Admin";
	if (rest.length === 0) return [{ label: title }];
	return [{ label: title, href: base }, { label: "Details" }];
}
