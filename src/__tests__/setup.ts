// Shared test setup: DOM matchers and the browser APIs jsdom lacks.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
	cleanup();
});

// Radix UI measures elements and checks pointer capture
globalThis.ResizeObserver ??= vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
})) as unknown as typeof ResizeObserver;
Object.assign(Element.prototype, {
	hasPointerCapture: vi.fn(() => false),
	scrollIntoView: vi.fn(),
});
