import { describe, expect, it } from "vitest";

import {
	ACTION_RULES,
	PERMISSIONS,
	hasPermission,
	ruleForPath,
	satisfiesRule,
} from "@/lib/permissions";

const staff = (...perms: string[]) => ({ role: "staff", staffPermissions: perms });

describe("permissions", () => {
	it("lets a superadmin do everything", () => {
		const admin = { role: "superadmin" };
		expect(hasPermission(admin, PERMISSIONS.FINANCE)).toBe(true);
		expect(satisfiesRule(admin, ACTION_RULES.processRefund)).toBe(true);
	});

	it("never lets staff through a superadmin-only rule", () => {
		const all = Object.values(PERMISSIONS);
		expect(satisfiesRule(staff(...all), ACTION_RULES.processRefund)).toBe(false);
	});

	it("needs every permission in `all` and one in `any`", () => {
		const rule = ACTION_RULES.updateAccountStatus;
		expect(satisfiesRule(staff(PERMISSIONS.CUSTOMERS), rule)).toBe(false);
		expect(satisfiesRule(staff(PERMISSIONS.EDIT), rule)).toBe(false);
		expect(satisfiesRule(staff(PERMISSIONS.RIDERS, PERMISSIONS.EDIT), rule)).toBe(true);
	});

	it("gives other roles and signed-out users nothing", () => {
		expect(hasPermission({ role: "customer" }, PERMISSIONS.FINANCE)).toBe(false);
		expect(hasPermission(null, PERMISSIONS.FINANCE)).toBe(false);
	});

	it("matches screen rules by path prefix only on segment boundaries", () => {
		expect(ruleForPath("/finance-management")).toEqual({ all: [PERMISSIONS.FINANCE] });
		expect(ruleForPath("/finance-management/abc")).toEqual({ all: [PERMISSIONS.FINANCE] });
		expect(ruleForPath("/finance-management-old")).toBeUndefined();
		expect(ruleForPath("/dashboard")).toBeUndefined();
	});
});
