import { describe, expect, it } from "vitest";

import {
	EMPTY_PROMO_FORM,
	promoFormError,
	promoPayload,
	promoState,
	promoValueLabel,
	surgeLabel,
	zoneRowsToOverrides,
	zoneToRow,
} from "@/lib/moneyTools";

const now = new Date("2026-06-15T12:00:00Z");

describe("promo codes", () => {
	it("describes the discount", () => {
		expect(promoValueLabel({ type: "percent", value: 10 })).toBe("10% off");
		expect(promoValueLabel({ type: "percent", value: 10, maxDiscount: 1500 })).toBe(
			"10% off (up to ₦1,500)",
		);
		expect(promoValueLabel({ type: "fixed", value: 500 })).toBe("₦500 off");
		expect(promoValueLabel({ type: "free_delivery", value: 0 })).toBe("Free delivery");
	});

	it("works out whether a code is live", () => {
		const base = { active: true, uses: 0 };
		expect(promoState(base, now)).toBe("active");
		expect(promoState({ ...base, active: false }, now)).toBe("paused");
		expect(promoState({ ...base, endsAt: "2026-06-01T00:00:00Z" }, now)).toBe("expired");
		expect(promoState({ ...base, startsAt: "2026-07-01T00:00:00Z" }, now)).toBe("scheduled");
		expect(promoState({ ...base, usageLimit: 5, uses: 5 }, now)).toBe("used_up");
	});

	it("checks the form before sending", () => {
		expect(promoFormError({ ...EMPTY_PROMO_FORM, code: "x", value: "10" }, true)).toMatch(
			/3 to 20/,
		);
		expect(promoFormError({ ...EMPTY_PROMO_FORM, code: "SAVE", value: "" }, true)).toMatch(
			/discount/,
		);
		expect(promoFormError({ ...EMPTY_PROMO_FORM, code: "SAVE", value: "150" }, true)).toMatch(
			/100/,
		);
		expect(
			promoFormError({ ...EMPTY_PROMO_FORM, code: "FREE", type: "free_delivery" }, true),
		).toBeNull();
		expect(
			promoFormError(
				{
					...EMPTY_PROMO_FORM,
					code: "SAVE",
					value: "10",
					startsAt: "2026-06-10T10:00",
					endsAt: "2026-06-09T10:00",
				},
				true,
			),
		).toMatch(/after the start/);
	});

	it("sends cleaned values, and never the code or type of an existing promo", () => {
		const form = {
			...EMPTY_PROMO_FORM,
			code: " save10 ",
			value: "10",
			maxDiscount: "₦1,500",
			usageLimit: "",
			states: "Lagos, , Abuja",
		};
		const created = promoPayload(form, true);
		expect(created).toMatchObject({
			code: "SAVE10",
			type: "percent",
			value: 10,
			maxDiscount: 1500,
			usageLimit: "",
			states: ["Lagos", "Abuja"],
		});
		const edited = promoPayload(form, false);
		expect(edited.code).toBeUndefined();
		expect(edited.type).toBeUndefined();
		expect(promoPayload({ ...form, type: "fixed" }, false).maxDiscount).toBe("");
	});
});

describe("delivery pricing", () => {
	it("labels surges", () => {
		expect(surgeLabel({ multiplier: 1.5, state: "Lagos" })).toBe("1.5x in Lagos");
		expect(surgeLabel({ multiplier: 2, state: null })).toBe("2x everywhere");
	});

	it("turns zone rows into fee overrides, leaving empty fields to the national rate", () => {
		const lagos = {
			...zoneToRow({ state: "Lagos", deliveryBaseFee: 900 }),
			extraBlockFee: "250",
		};
		const result = zoneRowsToOverrides([lagos]);
		expect(result).toEqual({
			overrides: [{ state: "Lagos", deliveryBaseFee: 900, extraBlockFee: 250 }],
		});
	});

	it("refuses unnamed, repeated or non-numeric zones", () => {
		const row = zoneToRow({ state: "Lagos" });
		expect(zoneRowsToOverrides([{ ...row, state: " " }])).toEqual({
			error: "Every zone needs a state.",
		});
		expect(zoneRowsToOverrides([row, { ...row, state: "lagos" }])).toEqual({
			error: "lagos is listed twice.",
		});
		expect(zoneRowsToOverrides([{ ...row, deliveryBaseFee: "abc" }])).toEqual({
			error: "Lagos: Base delivery (₦) must be a number.",
		});
	});
});
