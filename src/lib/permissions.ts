// src/lib/permissions.ts
// Staff permission keys and the rules for which screens/actions need them.
// The keys must match gohive-backend/utils/adminPermissions.js and the checkboxes
// in SettingsActionModal; the rules mirror gohive-backend/routes/adminRoutes.js.

import { ROUTES } from "@/constants/routes";

export const PERMISSIONS = {
	CUSTOMERS: "Customer Management",
	VENDORS: "Vendor Management",
	RIDERS: "Rider Management",
	EDIT: "Edit",
	MESSAGING: "Messaging",
	FINANCE: "Finance",
	SUPPORT: "Customer Support",
	BROADCAST: "Broadcast",
	ANALYTICS: "Analytics & Reports",
	DOWNLOAD: "Download",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// all: must hold every listed permission. any: must hold at least one.
// superadminOnly: staff never pass, whatever they were granted.
export interface PermissionRule {
	all?: Permission[];
	any?: Permission[];
	superadminOnly?: boolean;
}

export interface PermissionSubject {
	role?: string;
	staffPermissions?: string[];
}

const P = PERMISSIONS;

// Write actions, named after the backend route they hit.
export const ACTION_RULES = {
	updateVendorStatus: { all: [P.VENDORS, P.EDIT] },
	updateRiderStatus: { all: [P.RIDERS, P.EDIT] },
	updateAccountStatus: { any: [P.CUSTOMERS, P.VENDORS, P.RIDERS], all: [P.EDIT] },
	alertVendor: { all: [P.VENDORS, P.MESSAGING] },
	manageVendorStaff: { all: [P.VENDORS, P.EDIT] },
	processRefund: { superadminOnly: true },
	manageVendorCategories: { superadminOnly: true },
	download: { all: [P.DOWNLOAD] },
	viewAuditLog: { superadminOnly: true },
} satisfies Record<string, PermissionRule>;

// Screen access, matched by path prefix. Routes not listed are open to any admin.
export const ROUTE_RULES: { prefix: string; rule: PermissionRule }[] = [
	{ prefix: ROUTES.CUSTOMERS, rule: { all: [P.CUSTOMERS] } },
	{ prefix: ROUTES.VENDORS, rule: { all: [P.VENDORS] } },
	{ prefix: ROUTES.RIDERS, rule: { all: [P.RIDERS] } },
	{ prefix: ROUTES.ORDERS, rule: { any: [P.CUSTOMERS, P.VENDORS, P.RIDERS, P.SUPPORT] } },
	{ prefix: ROUTES.SUPPORT, rule: { all: [P.SUPPORT] } },
	{ prefix: ROUTES.FINANCE, rule: { all: [P.FINANCE] } },
	{ prefix: ROUTES.ANALYTICS, rule: { all: [P.ANALYTICS] } },
	// Mostly staff/invitation management, which the backend keeps superadmin-only.
	{ prefix: ROUTES.USERS, rule: { superadminOnly: true } },
	// Lists riders and vendors side by side.
	{ prefix: ROUTES.ACTIVE_USERS, rule: { all: [P.RIDERS, P.VENDORS] } },
];

export const isSuperAdmin = (user?: PermissionSubject | null) => user?.role === "superadmin";

export const hasPermission = (
	user: PermissionSubject | null | undefined,
	permission: Permission,
) => {
	if (!user) return false;
	if (user.role === "superadmin") return true;
	if (user.role !== "staff") return false;
	return (user.staffPermissions ?? []).includes(permission);
};

export const satisfiesRule = (
	user: PermissionSubject | null | undefined,
	rule?: PermissionRule,
) => {
	if (!rule) return true;
	if (isSuperAdmin(user)) return true;
	if (rule.superadminOnly) return false;
	if (rule.all && !rule.all.every((p) => hasPermission(user, p))) return false;
	if (rule.any && !rule.any.some((p) => hasPermission(user, p))) return false;
	return true;
};

export const ruleForPath = (pathname: string): PermissionRule | undefined =>
	ROUTE_RULES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`))
		?.rule;

export const describeRule = (rule: PermissionRule) => {
	if (rule.superadminOnly) return "Super Admin role";
	const parts: string[] = [];
	if (rule.all?.length) parts.push(rule.all.join(" and "));
	if (rule.any?.length) parts.push(`one of ${rule.any.join(", ")}`);
	return parts.join(", plus ");
};
