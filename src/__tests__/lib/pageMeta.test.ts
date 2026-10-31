import { describe, expect, it } from "vitest";

import { pageCrumbs } from "@/constants/pageMeta";

describe("pageCrumbs", () => {
	it("names a top-level screen", () => {
		expect(pageCrumbs("/order-management")).toEqual([{ label: "Orders" }]);
	});

	it("links back to the list from a details page", () => {
		expect(pageCrumbs("/customer-management/abc")).toEqual([
			{ label: "Customers", href: "/customer-management" },
			{ label: "Details" },
		]);
	});

	it("falls back for unknown screens", () => {
		expect(pageCrumbs("/nowhere")).toEqual([{ label: "GoHive Admin" }]);
	});
});
