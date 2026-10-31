import { describe, expect, it } from "vitest";

import { buildOrderTimeline } from "@/lib/orderTimeline";

describe("buildOrderTimeline", () => {
	it("marks steps up to the current status as done", () => {
		const steps = buildOrderTimeline({
			status: "ready",
			createdAt: "2026-10-01T10:00:00Z",
			orderAcceptedAt: "2026-10-01T10:05:00Z",
			orderReadyAt: "2026-10-01T10:20:00Z",
		});
		expect(steps.map((s) => s.state)).toEqual([
			"done",
			"done",
			"done",
			"done",
			"pending",
			"pending",
		]);
		expect(steps[3]?.at).toBe("2026-10-01T10:20:00Z");
	});

	it("ends a cancelled order with a failed step after the steps it reached", () => {
		const steps = buildOrderTimeline({
			status: "cancelled",
			createdAt: "2026-10-01T10:00:00Z",
			orderAcceptedAt: "2026-10-01T10:05:00Z",
			orderEndedAt: "2026-10-01T10:30:00Z",
		});
		expect(steps.map((s) => s.key)).toEqual(["placed", "accepted", "cancelled"]);
		expect(steps.at(-1)).toMatchObject({ state: "failed", at: "2026-10-01T10:30:00Z" });
	});

	it("shows no progress steps for a failed payment", () => {
		const steps = buildOrderTimeline({
			status: "payment_failed",
			createdAt: "2026-10-01T10:00:00Z",
		});
		expect(steps).toHaveLength(1);
		expect(steps[0]?.label).toBe("Payment failed");
	});
});
