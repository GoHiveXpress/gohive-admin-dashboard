import { describe, expect, it } from "vitest";

import {
	canAssignRider,
	canCancel,
	canRemoveRider,
	overrideTargets,
} from "@/lib/orderIntervention";

const rider = { _id: "r1" };

describe("order intervention rules", () => {
	it("cancels only orders still in progress", () => {
		expect(canCancel({ status: "picked_up" })).toBe(true);
		expect(canCancel({ status: "delivered" })).toBe(false);
		expect(canCancel({ status: "cancelled" })).toBe(false);
	});

	it("takes a rider off only before pickup", () => {
		expect(canRemoveRider({ status: "ready", rider })).toBe(true);
		expect(canRemoveRider({ status: "picked_up", rider })).toBe(false);
		expect(canRemoveRider({ status: "ready" })).toBe(false);
		expect(canAssignRider({ status: "picked_up" })).toBe(true);
		expect(canAssignRider({ status: "delivered" })).toBe(false);
	});

	it("only moves an order forward", () => {
		expect(overrideTargets({ status: "picked_up", paymentStatus: "completed", rider })).toEqual(
			["delivered"],
		);
		expect(overrideTargets({ status: "delivered", paymentStatus: "completed", rider })).toEqual(
			[],
		);
		expect(overrideTargets({ status: "cancelled" })).toEqual([]);
	});

	it("needs a rider for pickup and a payment for delivery", () => {
		expect(overrideTargets({ status: "placed", paymentStatus: "completed" })).toEqual([
			"preparing",
			"ready",
		]);
		expect(overrideTargets({ status: "ready", paymentStatus: "pending", rider })).toEqual([
			"picked_up",
		]);
	});
});
