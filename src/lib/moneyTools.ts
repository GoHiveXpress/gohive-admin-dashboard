// src/lib/moneyTools.ts
// Pure helpers for the promo code and delivery surge screens.
import {
	type DeliverySurge,
	type PromoCode,
	type PromoCodePayload,
	type PromoType,
} from "@/types/financeManagement";
import { type FeeStateOverride } from "@/types/integrationSettings";

const naira = (value: number) => `₦${value.toLocaleString()}`;

/** "10% off (up to ₦1,500)", "₦500 off", "Free delivery". */
export const promoValueLabel = (promo: Pick<PromoCode, "type" | "value" | "maxDiscount">) => {
	if (promo.type === "free_delivery") return "Free delivery";
	if (promo.type === "fixed") return `${naira(promo.value)} off`;
	return promo.maxDiscount
		? `${promo.value}% off (up to ${naira(promo.maxDiscount)})`
		: `${promo.value}% off`;
};

export type PromoState = "active" | "scheduled" | "expired" | "used_up" | "paused";

export const PROMO_STATE_LABELS: Record<PromoState, string> = {
	active: "Active",
	scheduled: "Scheduled",
	expired: "Expired",
	used_up: "Used up",
	paused: "Paused",
};

export const promoState = (
	promo: Pick<PromoCode, "active" | "startsAt" | "endsAt" | "usageLimit" | "uses">,
	now = new Date(),
): PromoState => {
	if (!promo.active) return "paused";
	if (promo.endsAt && new Date(promo.endsAt) <= now) return "expired";
	if (promo.usageLimit && promo.uses >= promo.usageLimit) return "used_up";
	if (promo.startsAt && new Date(promo.startsAt) > now) return "scheduled";
	return "active";
};

export interface PromoForm {
	code: string;
	type: PromoType;
	value: string;
	maxDiscount: string;
	minSubtotal: string;
	startsAt: string;
	endsAt: string;
	usageLimit: string;
	perCustomerLimit: string;
	states: string;
	description: string;
	firstOrderOnly: boolean;
	active: boolean;
}

export const EMPTY_PROMO_FORM: PromoForm = {
	code: "",
	type: "percent",
	value: "",
	maxDiscount: "",
	minSubtotal: "",
	startsAt: "",
	endsAt: "",
	usageLimit: "",
	perCustomerLimit: "1",
	states: "",
	description: "",
	firstOrderOnly: false,
	active: true,
};

// datetime-local wants "YYYY-MM-DDTHH:mm" in local time
const toLocalInput = (iso?: string) => {
	if (!iso) return "";
	const date = new Date(iso);
	const offset = date.getTimezoneOffset() * 60000;
	return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const text = (value?: number) => (value === undefined || value === null ? "" : String(value));

export const promoToForm = (promo: PromoCode): PromoForm => ({
	code: promo.code,
	type: promo.type,
	value: promo.type === "free_delivery" ? "" : String(promo.value),
	maxDiscount: text(promo.maxDiscount),
	minSubtotal: promo.minSubtotal ? String(promo.minSubtotal) : "",
	startsAt: toLocalInput(promo.startsAt),
	endsAt: toLocalInput(promo.endsAt),
	usageLimit: text(promo.usageLimit),
	perCustomerLimit: text(promo.perCustomerLimit),
	states: promo.states.join(", "),
	description: promo.description ?? "",
	firstOrderOnly: promo.firstOrderOnly,
	active: promo.active,
});

const numberOrEmpty = (value: string): number | "" => {
	const trimmed = value.replace(/[₦,\s]/g, "");
	return trimmed ? Number(trimmed) : "";
};

const dateOrEmpty = (value: string) => (value ? new Date(value).toISOString() : "");

/** What the form sends; the backend does the real checking. Existing codes never send code or type. */
export const promoPayload = (form: PromoForm, isNew: boolean): PromoCodePayload => ({
	...(isNew ? { code: form.code.trim().toUpperCase(), type: form.type } : {}),
	...(form.type === "free_delivery" ? {} : { value: numberOrEmpty(form.value) }),
	maxDiscount: form.type === "percent" ? numberOrEmpty(form.maxDiscount) : "",
	minSubtotal: numberOrEmpty(form.minSubtotal),
	startsAt: dateOrEmpty(form.startsAt),
	endsAt: dateOrEmpty(form.endsAt),
	usageLimit: numberOrEmpty(form.usageLimit),
	perCustomerLimit: numberOrEmpty(form.perCustomerLimit),
	states: form.states
		.split(",")
		.map((state) => state.trim())
		.filter(Boolean),
	description: form.description.trim(),
	firstOrderOnly: form.firstOrderOnly,
	active: form.active,
});

/** A quick check before sending, or null. */
export const promoFormError = (form: PromoForm, isNew: boolean): string | null => {
	if (isNew && !/^[A-Za-z0-9_-]{3,20}$/.test(form.code.trim())) {
		return "Codes are 3 to 20 letters, numbers, dashes or underscores.";
	}
	if (form.type !== "free_delivery") {
		const value = numberOrEmpty(form.value);
		if (value === "" || !Number.isFinite(value) || value <= 0) return "Enter the discount.";
		if (form.type === "percent" && value > 100)
			return "A percent discount can't be more than 100.";
	}
	if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) {
		return "The end must be after the start.";
	}
	return null;
};

/** "1.5x in Lagos", "2x everywhere". */
export const surgeLabel = (surge: Pick<DeliverySurge, "multiplier" | "state">) =>
	`${surge.multiplier}x ${surge.state ? `in ${surge.state}` : "everywhere"}`;

/** "until 6:30 PM", "until ended". */
export const surgeUntil = (surge: Pick<DeliverySurge, "endsAt">) =>
	surge.endsAt
		? `until ${new Date(surge.endsAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}`
		: "until someone ends it";

// --- Per-state fee zones (fee-config stateOverrides) ---

export const ZONE_FIELDS = [
	{ key: "deliveryBaseFee", label: "Base delivery (₦)" },
	{ key: "serviceFeePercent", label: "Service fee (%)" },
	{ key: "baseDistanceKm", label: "Base distance (km)" },
	{ key: "extraBlockDistanceKm", label: "Block (km)" },
	{ key: "extraBlockFee", label: "Block fee (₦)" },
	{ key: "maxDistanceKm", label: "Max distance (km)" },
] as const satisfies readonly { key: keyof Omit<FeeStateOverride, "state">; label: string }[];

export type ZoneField = (typeof ZONE_FIELDS)[number]["key"];
export type ZoneRow = { state: string } & Record<ZoneField, string>;

export const zoneToRow = (override: FeeStateOverride): ZoneRow =>
	ZONE_FIELDS.reduce(
		(row, { key }) => ({
			...row,
			[key]: override[key] === undefined ? "" : String(override[key]),
		}),
		{ state: override.state } as ZoneRow,
	);

export const emptyZoneRow = (): ZoneRow => zoneToRow({ state: "" });

/** Rows to what fee-config takes; empty fields fall back to the national rate. */
export const zoneRowsToOverrides = (
	rows: ZoneRow[],
): { overrides: FeeStateOverride[] } | { error: string } => {
	const seen = new Set<string>();
	const overrides: FeeStateOverride[] = [];
	let error: string | null = null;
	rows.some((row) => {
		const state = row.state.trim();
		if (!state) error = "Every zone needs a state.";
		else if (seen.has(state.toLowerCase())) error = `${state} is listed twice.`;
		if (error) return true;
		seen.add(state.toLowerCase());
		const override: FeeStateOverride = { state };
		const bad = ZONE_FIELDS.find(({ key }) => {
			const value = row[key].trim();
			if (!value) return false;
			const number = Number(value);
			if (!Number.isFinite(number) || number < 0) return true;
			override[key] = number;
			return false;
		});
		if (bad) {
			error = `${state}: ${bad.label} must be a number.`;
			return true;
		}
		overrides.push(override);
		return false;
	});
	return error ? { error } : { overrides };
};
