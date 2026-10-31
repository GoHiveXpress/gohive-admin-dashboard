// Server-side CSV export: hidden without the Download permission, sends the
// filters on screen, and reports how many rows came back or why it failed.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ServerExportButton from "@/components/_atoms/ServerExportButton";

const download = vi.fn();
let canDownload = true;

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/services/exports", () => ({
	exportsApi: { download: (...args: unknown[]): unknown => download(...args) },
}));
vi.mock("@/hooks/usePermissions", () => ({
	usePermissions: () => ({ allows: () => canDownload, isLoading: false }),
}));

describe("server export", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		canDownload = true;
	});

	it("is hidden without the Download permission", () => {
		canDownload = false;
		const { container } = render(<ServerExportButton dataset="orders" params={{}} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("exports with the filters and reports the row count", async () => {
		download.mockResolvedValue({ filename: "orders-2026-10-31.csv", rows: 1234 });
		render(
			<ServerExportButton dataset="orders" params={{ status: "delivered", range: "week" }} />,
		);
		await userEvent.setup().click(screen.getByRole("button", { name: /export all/i }));
		expect(download).toHaveBeenCalledWith("orders", { status: "delivered", range: "week" });
		expect(toast.success).toHaveBeenCalledWith(`Exported ${(1234).toLocaleString()} rows`);
	});

	it("shows the server's reason when the export fails", async () => {
		download.mockRejectedValue(new Error("Too many rows. Narrow the filters."));
		render(<ServerExportButton dataset="transactions" params={{}} />);
		await userEvent.setup().click(screen.getByRole("button", { name: /export all/i }));
		expect(toast.error).toHaveBeenCalledWith("Too many rows. Narrow the filters.");
	});
});
