// Refund: only superadmins see the panel, the amount is checked, and the
// request goes out once, with an idempotency key, after confirmation.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RefundPanel from "@/components/Order/OrderManagement/RefundPanel";

const processRefund = vi.fn();
let role = "superadmin";
let refundLogs: unknown[] = [];

vi.mock("next-auth/react", () => ({ useSession: () => ({ data: { user: { role } } }) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/hooks/financeManagement", () => ({
	useProcessRefund: () => ({ mutate: processRefund, isPending: false }),
	useRefundLogs: () => ({ data: { data: refundLogs }, isLoading: false }),
	useRefundRequests: () => ({ data: { data: [] }, isLoading: false }),
}));

const order = {
	_id: "order-db-id-123456",
	orderId: "GH-000123",
	status: "preparing",
	paymentStatus: "completed",
	paymentMethod: "card",
	totalAmount: 4000,
	customer: { name: "Ada" },
};

describe("refund", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		role = "superadmin";
		refundLogs = [];
	});

	it("is hidden from staff", () => {
		role = "staff";
		const { container } = render(<RefundPanel order={order} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("rejects more than the order total", async () => {
		render(<RefundPanel order={order} />);
		const user = userEvent.setup();
		const amount = screen.getByLabelText("Refund amount (₦)");
		await user.clear(amount);
		await user.type(amount, "5000");
		expect(screen.getByText(/more than the order total/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Process Refund" })).toBeDisabled();
	});

	it("needs a reason, then refunds and cancels after confirming", async () => {
		render(<RefundPanel order={order} />);
		const user = userEvent.setup();
		const submit = screen.getByRole("button", { name: "Process Refund" });
		expect(submit).toBeDisabled();

		await user.type(screen.getByLabelText("Reason"), "Item missing");
		await user.click(screen.getByLabelText(/also cancel this order/i));
		await user.click(submit);
		expect(processRefund).not.toHaveBeenCalled();

		await user.click(await screen.findByRole("button", { name: "Confirm refund" }));
		expect(processRefund).toHaveBeenCalledTimes(1);
		expect(processRefund).toHaveBeenCalledWith(
			expect.objectContaining({
				orderId: order._id,
				amount: 4000,
				reason: "Item missing",
				cancelOrder: true,
			}),
			expect.anything(),
		);
		const [request] = processRefund.mock.calls[0] as [{ idempotencyKey: string }];
		expect(request.idempotencyKey).toMatch(/\S/);
	});

	it("shows an existing refund instead of the form", () => {
		refundLogs = [
			{
				dbOrderId: order._id,
				refundAmount: "₦4,000",
				reason: "Late",
				createdAt: "2026-10-01T10:00:00Z",
			},
		];
		render(<RefundPanel order={order} />);
		expect(screen.getByText(/only be refunded once/i)).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Process Refund" })).not.toBeInTheDocument();
	});
});
