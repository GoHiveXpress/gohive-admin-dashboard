// src/lib/accountTools.ts
// Pure helpers for the Phase 9 customer, vendor and scheduling screens.
// Limits mirror gohive-backend/utils/accountTools.js and utils/broadcasts.js.
import { type VendorClosure, type WalletTransaction } from "@/types/accountTools";
import { type OperatingHours } from "@/types/vendorManagement";

export const DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
] as const;

export const MAX_CLOSURE_HOURS = 24 * 30;
export const MAX_COMMISSION_PERCENT = 50;
export const MAX_SCHEDULE_DAYS = 90;

const formatWhen = (value: string | Date) =>
	new Date(value).toLocaleString("en-NG", {
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit",
	});

/** True while an admin closure is in force. */
export const isClosedNow = (closure: VendorClosure | null | undefined, now = new Date()) => {
	if (!closure?.at) return false;
	return !closure.until || new Date(closure.until) > now;
};

/** "Closed by GoHive until 31 Oct, 2:00 pm" or "Closed by GoHive until reopened". */
export const closureLabel = (closure: VendorClosure) =>
	closure.until
		? `Closed by GoHive until ${formatWhen(closure.until)}`
		: "Closed by GoHive until reopened";

/** Checks the "close for N hours" field. Empty means until reopened. */
export const closureError = (reason: string, hours: string) => {
	if (reason.trim().length < 3) return "Say why the store is being closed.";
	if (!hours.trim()) return null;
	const value = Number(hours);
	if (!Number.isInteger(value) || value < 1 || value > MAX_CLOSURE_HOURS) {
		return `Close for between 1 and ${MAX_CLOSURE_HOURS} hours, or leave it empty.`;
	}
	return null;
};

const TWELVE_HOUR = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;

/** "09:00 PM" -> "21:00" for <input type="time">. Unreadable values give "". */
export const to24Hour = (value: string) => {
	const match = TWELVE_HOUR.exec(value.trim());
	if (!match) return "";
	const hour = Number(match[1]) % 12;
	const offset = match[3]?.toUpperCase() === "PM" ? 12 : 0;
	return `${String(hour + offset).padStart(2, "0")}:${match[2]}`;
};

/** "21:00" -> "09:00 PM", the format the backend stores. */
export const to12Hour = (value: string) => {
	const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
	if (!match) return "";
	const h = Number(match[1]);
	const m = Number(match[2]);
	const suffix = h >= 12 ? "PM" : "AM";
	const hour = h % 12 === 0 ? 12 : h % 12;
	return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
};

/** A full week in day order, filling any day the vendor never set as closed. */
export const fullWeek = (hours: OperatingHours[] | undefined): OperatingHours[] =>
	DAYS.map(
		(day) =>
			hours?.find((entry) => entry.day === day) ?? {
				day,
				isOpen: false,
				is24Hours: false,
				openTime: "09:00 AM",
				closeTime: "09:00 PM",
			},
	);

/** The first problem with an hours form, or null. */
export const hoursError = (hours: OperatingHours[]) => {
	const problem = hours.find(
		(entry) =>
			entry.isOpen &&
			!entry.is24Hours &&
			(!to24Hour(entry.openTime) ||
				!to24Hour(entry.closeTime) ||
				to24Hour(entry.openTime) === to24Hour(entry.closeTime)),
	);
	if (!problem) return null;
	if (!to24Hour(problem.openTime) || !to24Hour(problem.closeTime)) {
		return `Set both times for ${problem.day}.`;
	}
	return `${problem.day} opens and closes at the same time.`;
};

/** Parses the commission field: a number from 0 to 50, two decimals at most. */
export const parseCommission = (value: string): { percent: number } | { error: string } => {
	if (!value.trim()) return { error: "Enter the commission as a percent." };
	const percent = Number(value);
	if (Number.isNaN(percent)) return { error: "Enter the commission as a percent." };
	if (percent < 0 || percent > MAX_COMMISSION_PERCENT) {
		return { error: `Commission must be between 0 and ${MAX_COMMISSION_PERCENT}%.` };
	}
	return { percent: Math.round(percent * 100) / 100 };
};

/** Checks a "send later" time against what the backend accepts. */
export const scheduleError = (value: string, now = new Date()) => {
	if (!value) return "Pick a date and time to send it.";
	const at = new Date(value);
	if (Number.isNaN(at.getTime())) return "Pick a date and time to send it.";
	if (at.getTime() < now.getTime() + 60 * 1000) return "Pick a time at least a minute from now.";
	if (at.getTime() > now.getTime() + MAX_SCHEDULE_DAYS * 24 * 60 * 60 * 1000) {
		return `Pick a time within the next ${MAX_SCHEDULE_DAYS} days.`;
	}
	return null;
};

/** "2026-10-31T14:30" for a datetime-local input, in the browser's time zone. */
export const toLocalInput = (date: Date) => {
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
		date.getHours(),
	)}:${pad(date.getMinutes())}`;
};

export const CATEGORY_LABELS: Record<WalletTransaction["category"], string> = {
	order_payout: "Order payout",
	withdrawal: "Withdrawal",
	wallet_topup: "Wallet top-up",
	referral_bonus: "Referral bonus",
	refund: "Refund",
	order_payment: "Order payment",
	adjustment: "Adjustment",
};

/** "+₦1,500" for credits, "−₦1,500" for debits. */
export const signedAmount = (tx: Pick<WalletTransaction, "type" | "amount">) =>
	`${tx.type === "credit" ? "+" : "−"}₦${Math.abs(tx.amount).toLocaleString()}`;
