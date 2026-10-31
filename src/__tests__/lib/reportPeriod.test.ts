import { describe, expect, it } from "vitest";
import {
	type ReportPeriod,
	canCompare,
	compareLabel,
	defaultReportPeriod,
	periodError,
	periodParams,
	periodSlug,
} from "@/lib/reportPeriod";

const custom = (from: string, to: string, compare = true): ReportPeriod => ({
	preset: "custom",
	from,
	to,
	compare,
});

describe("defaultReportPeriod", () => {
	it("is the last 30 days, compared", () => {
		const period = defaultReportPeriod(new Date(2026, 9, 31, 12));
		expect(period).toEqual({
			preset: "monthly",
			from: "2026-10-02",
			to: "2026-10-31",
			compare: true,
		});
	});
});

describe("periodParams", () => {
	it("sends a preset as range", () => {
		expect(
			periodParams({ ...defaultReportPeriod(), preset: "weekly", compare: false }),
		).toEqual({
			range: "weekly",
		});
	});

	it("sends custom dates and the comparison", () => {
		expect(periodParams(custom("2026-01-01", "2026-01-31"))).toEqual({
			start_date: "2026-01-01",
			end_date: "2026-01-31",
			compareWith: "previous_period",
		});
	});

	it("never compares all time", () => {
		const period: ReportPeriod = {
			...defaultReportPeriod(),
			preset: "all_time",
			compare: true,
		};
		expect(canCompare(period)).toBe(false);
		expect(periodParams(period)).toEqual({ range: "all_time" });
		expect(compareLabel(period)).toBeNull();
	});
});

describe("periodError", () => {
	it("accepts presets whatever the dates", () => {
		expect(periodError({ preset: "today", from: "", to: "", compare: false })).toBeNull();
	});

	it("rejects missing, reversed and over-long custom dates", () => {
		expect(periodError(custom("", "2026-01-01"))).toMatch(/start and end/);
		expect(periodError(custom("2026-02-01", "2026-01-01"))).toMatch(/on or after/);
		expect(periodError(custom("2024-01-01", "2026-01-02"))).toMatch(/two years/);
		expect(periodError(custom("2024-01-02", "2026-01-01"))).toBeNull();
	});
});

describe("compareLabel", () => {
	it("names the period before a preset", () => {
		expect(compareLabel({ ...defaultReportPeriod(), preset: "today" })).toBe("yesterday");
		expect(compareLabel({ ...defaultReportPeriod(), preset: "weekly" })).toBe(
			"the 7 days before",
		);
	});

	it("works out the same-length period before custom dates", () => {
		expect(compareLabel(custom("2026-03-01", "2026-03-31"))).toBe("2026-01-29 to 2026-02-28");
		expect(compareLabel(custom("2026-03-01", "2026-03-01"))).toBe("2026-02-28");
		expect(compareLabel(custom("2026-03-05", "2026-03-01"))).toBeNull();
	});
});

describe("periodSlug", () => {
	it("tags export filenames", () => {
		expect(periodSlug(defaultReportPeriod())).toBe("monthly");
		expect(periodSlug(custom("2026-01-01", "2026-01-31"))).toBe("2026-01-01_2026-01-31");
	});
});
