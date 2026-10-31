import { describe, expect, it } from "vitest";

import {
	FIRST_RESPONSE_TARGET_MS,
	categoryLabel,
	formatDuration,
	priorityOf,
	responseTimer,
	ticketCode,
	ticketStatusOf,
	toDateInput,
} from "@/lib/supportTickets";

const opened = "2026-10-01T10:00:00Z";
const at = (minutes: number) => new Date(Date.parse(opened) + minutes * 60_000).toISOString();

describe("ticketCode", () => {
	it("pads ticket numbers", () => {
		expect(ticketCode({ _id: "abc", ticketNumber: 42 })).toBe("T-00042");
	});
	it("falls back to the end of the id for older chats", () => {
		expect(ticketCode({ _id: "65f0aa11bb22cc", ticketNumber: undefined })).toBe("#BB22CC");
	});
});

describe("defaults for older chats", () => {
	it("counts them as open, normal and uncategorised", () => {
		expect(ticketStatusOf({ ticketStatus: undefined })).toBe("open");
		expect(priorityOf({ priority: undefined })).toBe("normal");
		expect(categoryLabel(undefined)).toBe("Uncategorised");
		expect(categoryLabel("late_delivery")).toBe("Late delivery");
	});
});

describe("formatDuration", () => {
	it("picks a readable unit", () => {
		expect(formatDuration(undefined)).toBe("—");
		expect(formatDuration(45_000)).toBe("45s");
		expect(formatDuration(12 * 60_000)).toBe("12m");
		expect(formatDuration(185 * 60_000)).toBe("3h 5m");
		expect(formatDuration(52 * 3_600_000)).toBe("2d 4h");
	});
});

describe("responseTimer", () => {
	const base = { createdAt: opened, status: "active" as const };

	it("shows how long the first reply took", () => {
		expect(responseTimer({ ...base, firstResponseAt: at(5) }, Date.now())).toEqual({
			label: "Answered in 5m",
			tone: "ok",
		});
		expect(responseTimer({ ...base, firstResponseAt: at(40) }, Date.now()).tone).toBe(
			"warning",
		);
	});

	it("counts from when an agent was asked for", () => {
		const timer = responseTimer(
			{ ...base, agentRequestedAt: at(30), firstResponseAt: at(32) },
			Date.now(),
		);
		expect(timer.label).toBe("Answered in 2m");
	});

	it("turns late once the user has waited past the target", () => {
		const start = Date.parse(opened);
		expect(responseTimer(base, start + 5 * 60_000).tone).toBe("warning");
		expect(responseTimer(base, start + FIRST_RESPONSE_TARGET_MS + 60_000)).toEqual({
			label: "No reply for 16m",
			tone: "late",
		});
	});

	it("marks closed tickets nobody answered", () => {
		expect(responseTimer({ ...base, status: "closed" }, Date.now()).label).toBe(
			"Never answered",
		);
	});
});

describe("toDateInput", () => {
	it("uses local yyyy-mm-dd", () => {
		expect(toDateInput(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
	});
});
