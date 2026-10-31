import { describe, expect, it } from "vitest";

import {
	closureError,
	closureLabel,
	fullWeek,
	hoursError,
	isClosedNow,
	parseCommission,
	scheduleError,
	signedAmount,
	to12Hour,
	to24Hour,
} from "@/lib/accountTools";

const now = new Date("2026-10-31T10:00:00Z");

describe("store closures", () => {
	it("holds until it runs out", () => {
		expect(isClosedNow(null, now)).toBe(false);
		expect(isClosedNow({ at: now.toISOString(), until: null, reason: "Audit" }, now)).toBe(
			true,
		);
		const later = new Date(now.getTime() + 1000).toISOString();
		const earlier = new Date(now.getTime() - 1000).toISOString();
		expect(isClosedNow({ at: now.toISOString(), until: later, reason: "Audit" }, now)).toBe(
			true,
		);
		expect(isClosedNow({ at: now.toISOString(), until: earlier, reason: "Audit" }, now)).toBe(
			false,
		);
	});

	it("says how long it lasts", () => {
		expect(closureLabel({ at: now.toISOString(), until: null, reason: "Audit" })).toBe(
			"Closed by GoHive until reopened",
		);
		expect(
			closureLabel({ at: now.toISOString(), until: now.toISOString(), reason: "Audit" }),
		).toMatch(/^Closed by GoHive until /);
	});

	it("needs a reason and a sane length", () => {
		expect(closureError("Health check", "")).toBeNull();
		expect(closureError("Health check", "24")).toBeNull();
		expect(closureError("x", "")).toMatch(/why/);
		expect(closureError("Audit", "0")).toMatch(/between/);
		expect(closureError("Audit", "1.5")).toMatch(/between/);
		expect(closureError("Audit", "721")).toMatch(/between/);
	});
});

describe("opening hours", () => {
	it("converts between 12 and 24 hour times", () => {
		expect(to24Hour("09:00 AM")).toBe("09:00");
		expect(to24Hour("9:30 pm")).toBe("21:30");
		expect(to24Hour("12:00 AM")).toBe("00:00");
		expect(to24Hour("12:15 PM")).toBe("12:15");
		expect(to24Hour("25:00")).toBe("");
		expect(to12Hour("00:00")).toBe("12:00 AM");
		expect(to12Hour("13:05")).toBe("01:05 PM");
		expect(to12Hour("12:00")).toBe("12:00 PM");
		expect(to12Hour("")).toBe("");
	});

	it("fills a full week in order", () => {
		const week = fullWeek([
			{ day: "Sunday", isOpen: true, is24Hours: true, openTime: "", closeTime: "" },
		]);
		expect(week.map((d) => d.day)[0]).toBe("Monday");
		expect(week).toHaveLength(7);
		expect(week[6]?.is24Hours).toBe(true);
		expect(week[0]?.isOpen).toBe(false);
	});

	it("catches bad times on open days only", () => {
		const [, ...rest] = fullWeek([]);
		const monday = {
			day: "Monday",
			isOpen: true,
			is24Hours: false,
			openTime: "09:00 AM",
			closeTime: "09:00 AM",
		};
		expect(hoursError(rest)).toBeNull();
		expect(hoursError([monday, ...rest])).toMatch(/Monday opens and closes/);
		expect(hoursError([{ ...monday, closeTime: "" }, ...rest])).toMatch(
			/Set both times for Monday/,
		);
		expect(hoursError([{ ...monday, is24Hours: true }, ...rest])).toBeNull();
	});
});

describe("commission", () => {
	it("is 0 to 50 percent", () => {
		expect(parseCommission("12.345")).toEqual({ percent: 12.35 });
		expect(parseCommission("0")).toEqual({ percent: 0 });
		expect(parseCommission("")).toHaveProperty("error");
		expect(parseCommission("abc")).toHaveProperty("error");
		expect(parseCommission("51")).toHaveProperty("error");
	});
});

describe("scheduled sends", () => {
	it("must be in the next 90 days", () => {
		expect(scheduleError("", now)).toMatch(/Pick a date/);
		expect(scheduleError("2026-10-31T10:00:30Z", now)).toMatch(/minute/);
		expect(scheduleError("2026-11-01T09:00:00Z", now)).toBeNull();
		expect(scheduleError("2027-03-01T00:00:00Z", now)).toMatch(/90 days/);
	});
});

describe("wallet ledger", () => {
	it("signs amounts", () => {
		expect(signedAmount({ type: "credit", amount: 1500 })).toBe("+₦1,500");
		expect(signedAmount({ type: "debit", amount: 200 })).toBe("−₦200");
	});
});
