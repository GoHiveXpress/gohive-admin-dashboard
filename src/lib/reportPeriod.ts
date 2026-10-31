// The period an analytics report covers, and the query params the backend
// expects for it. Mirrors gohive-backend/utils/reportPeriod.js.
import { toDateInput } from "@/lib/supportTickets";

export type ReportPreset = "today" | "weekly" | "monthly" | "yearly" | "all_time" | "custom";

export interface ReportPeriod {
	preset: ReportPreset;
	// yyyy-mm-dd, both days included; only used for custom dates
	from: string;
	to: string;
	compare: boolean;
}

export const REPORT_PRESETS: ReportPreset[] = [
	"today",
	"weekly",
	"monthly",
	"yearly",
	"all_time",
	"custom",
];

export const REPORT_PRESET_LABELS: Record<ReportPreset, string> = {
	today: "Today",
	weekly: "Last 7 days",
	monthly: "Last 30 days",
	yearly: "Last 12 months",
	all_time: "All time",
	custom: "Custom dates",
};

const PREVIOUS_LABELS: Record<Exclude<ReportPreset, "custom" | "all_time">, string> = {
	today: "yesterday",
	weekly: "the 7 days before",
	monthly: "the 30 days before",
	yearly: "the 12 months before",
};

export const MAX_REPORT_DAYS = 731;

const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

// Calendar-day arithmetic in UTC so daylight saving never shifts a day
const dayNumber = (key: string) => Date.parse(`${key}T00:00:00Z`) / DAY_MS;
const dayKey = (n: number) => new Date(n * DAY_MS).toISOString().slice(0, 10);

export const defaultReportPeriod = (now = new Date()): ReportPeriod => ({
	preset: "monthly",
	from: toDateInput(new Date(now.getTime() - 29 * DAY_MS)),
	to: toDateInput(now),
	compare: true,
});

/** Why the period can't be used, or null when it can. */
export const periodError = (period: ReportPeriod): string | null => {
	if (period.preset !== "custom") return null;
	if (!DAY_KEY.test(period.from) || !DAY_KEY.test(period.to)) return "Pick a start and end date.";
	const days = dayNumber(period.to) - dayNumber(period.from) + 1;
	if (Number.isNaN(days)) return "Pick a start and end date.";
	if (days < 1) return "The end date must be on or after the start date.";
	if (days > MAX_REPORT_DAYS) return "Pick a period of two years or less.";
	return null;
};

export const canCompare = (period: ReportPeriod) => period.preset !== "all_time";

/** Query params for the analytics endpoints. */
export const periodParams = (period: ReportPeriod): Record<string, string | undefined> => {
	const params: Record<string, string | undefined> =
		period.preset === "custom"
			? { start_date: period.from, end_date: period.to }
			: { range: period.preset };
	if (period.compare && canCompare(period)) params.compareWith = "previous_period";
	return params;
};

/** What the period is compared with, e.g. "the 7 days before" or "2026-01-01 to 2026-01-07". */
export const compareLabel = (period: ReportPeriod): string | null => {
	if (period.preset === "all_time") return null;
	if (period.preset !== "custom") return PREVIOUS_LABELS[period.preset];
	if (periodError(period)) return null;
	const start = dayNumber(period.from);
	const days = dayNumber(period.to) - start + 1;
	const previousEnd = dayKey(start - 1);
	const previousStart = dayKey(start - days);
	return previousStart === previousEnd ? previousStart : `${previousStart} to ${previousEnd}`;
};

/** Short tag for export filenames, e.g. "monthly" or "2026-01-01_2026-01-31". */
export const periodSlug = (period: ReportPeriod) =>
	period.preset === "custom" ? `${period.from}_${period.to}` : period.preset;
