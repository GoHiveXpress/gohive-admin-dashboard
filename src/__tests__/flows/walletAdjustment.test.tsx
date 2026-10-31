// Wallet adjustments: the request form needs an account, amount and reason, and
// only another admin sees Approve on a pending adjustment.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import WalletAdjustmentTab from "@/components/FinanceManagement/WalletAdjustmentTab";

const requestAdjustment = vi.fn();
const decide = vi.fn();
let canManage = true;
let adjustments: unknown[] = [];

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/hooks/usePermissions", () => ({
	usePermissions: () => ({ allows: () => canManage }),
}));
vi.mock("@/hooks/financeManagement", () => ({
	useWalletAdjustments: () => ({
		data: { data: adjustments, pendingCount: adjustments.length, maxAmount: 100000 },
		isLoading: false,
		isError: false,
	}),
	useRequestWalletAdjustment: () => ({ mutate: requestAdjustment, isPending: false }),
	useDecideWalletAdjustment: () => ({ mutate: decide, isPending: false }),
}));

const pending = {
	_id: "adj-1",
	user: { _id: "u1", name: "Ada", role: "customer", phone: "0801" },
	type: "credit",
	amount: 2500,
	reason: "Goodwill credit for a late order",
	status: "pending",
	requestedBy: "a1",
	requestedByName: "Bola",
	createdAt: "2026-06-15T12:00:00Z",
	canApprove: true,
	isMine: false,
};

describe("wallet adjustments", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		canManage = true;
		adjustments = [];
	});

	it("hides the request form without Finance edit access", () => {
		canManage = false;
		render(<WalletAdjustmentTab />);
		expect(screen.queryByRole("button", { name: "Request approval" })).not.toBeInTheDocument();
	});

	it("refuses amounts over the limit", async () => {
		render(<WalletAdjustmentTab />);
		const user = userEvent.setup();
		await user.type(screen.getByLabelText("Amount (₦)"), "200000");
		expect(screen.getByText(/limited to ₦100,000/)).toBeInTheDocument();
	});

	it("sends a request once an account, amount and long enough reason are in", async () => {
		render(<WalletAdjustmentTab />);
		const user = userEvent.setup();
		const submit = screen.getByRole("button", { name: "Request approval" });
		await user.type(screen.getByLabelText("Customer, vendor or rider"), "ada@example.com");
		await user.type(screen.getByLabelText("Amount (₦)"), "1,500");
		await user.type(screen.getByLabelText("Reason"), "too short");
		expect(submit).toBeDisabled();

		await user.type(screen.getByLabelText("Reason"), " reason");
		await user.click(submit);
		expect(requestAdjustment).toHaveBeenCalledTimes(1);
		const [payload] = requestAdjustment.mock.calls[0] as [Record<string, unknown>];
		expect(payload).toMatchObject({
			account: "ada@example.com",
			type: "credit",
			amount: 1500,
			reason: "too short reason",
		});
		expect(payload.idempotencyKey).toMatch(/\S/);
	});

	it("lets another admin approve after confirming", async () => {
		adjustments = [pending];
		render(<WalletAdjustmentTab />);
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: "Approve" }));
		expect(decide).not.toHaveBeenCalled();
		await user.click(await screen.findByRole("button", { name: "Approve and apply" }));
		expect(decide).toHaveBeenCalledWith(
			expect.objectContaining({ id: "adj-1", decision: "approve" }),
			expect.anything(),
		);
	});

	it("offers the requester Withdraw, not Approve", () => {
		adjustments = [{ ...pending, isMine: true, canApprove: false }];
		render(<WalletAdjustmentTab />);
		expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Withdraw" })).toBeInTheDocument();
	});
});
