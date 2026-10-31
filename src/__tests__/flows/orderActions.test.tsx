// Order actions: cancelling needs a reason and a confirmation, only superadmins
// can refund in the same step, and staff without Edit see no actions at all.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import OrderActionsPanel from "@/components/Order/OrderManagement/OrderActionsPanel";
import OrderNotesPanel from "@/components/Order/OrderManagement/OrderNotesPanel";
import { satisfiesRule } from "@/lib/permissions";
import { type Order } from "@/types/customerManagement";

const cancelOrder = vi.fn();
const addNote = vi.fn();
let subject: { role: string; staffPermissions: string[] } = {
	role: "superadmin",
	staffPermissions: [],
};

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@iconify/react", () => ({ Icon: () => null }));
vi.mock("@/hooks/usePermissions", () => ({
	usePermissions: () => ({
		isSuperAdmin: subject.role === "superadmin",
		allows: (rule: Parameters<typeof satisfiesRule>[1]) => satisfiesRule(subject, rule),
		can: () => true,
	}),
}));
vi.mock("@/hooks/riderManagement", () => ({
	useRiders: () => ({ data: { data: [] }, isLoading: false }),
}));
vi.mock("@/hooks/customerManagement", () => ({
	useCancelOrder: () => ({ mutate: cancelOrder, isPending: false }),
	useChangeOrderRider: () => ({ mutate: vi.fn(), isPending: false }),
	useOverrideOrderStatus: () => ({ mutate: vi.fn(), isPending: false }),
	useOrderNotes: () => ({
		data: {
			data: [
				{
					_id: "n1",
					text: "Vendor called",
					authorName: "Ada",
					createdAt: "2026-10-01T10:00:00Z",
				},
			],
		},
		isLoading: false,
	}),
	useAddOrderNote: () => ({ mutate: addNote, isPending: false }),
}));

const order = {
	_id: "order-1",
	orderId: "GH-000123",
	status: "preparing",
	paymentStatus: "completed",
	totalAmount: 4000,
	createdAt: "2026-10-01T09:00:00Z",
	customer: { _id: "c1", name: "Ada", email: "ada@gohive.test", phone: "0800" },
	vendor: { _id: "v1", vendorProfile: { businessName: "Mama Put" } },
} as Order;

describe("order actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		subject = { role: "superadmin", staffPermissions: [] };
	});

	it("shows nothing to staff who can only view orders", () => {
		subject = { role: "staff", staffPermissions: ["Customer Support"] };
		const { container } = render(<OrderActionsPanel order={order} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("lets staff with Edit cancel, without a refund option", () => {
		subject = { role: "staff", staffPermissions: ["Customer Support", "Edit"] };
		render(<OrderActionsPanel order={order} />);
		expect(screen.getByRole("button", { name: "Cancel order" })).toBeInTheDocument();
		expect(screen.queryByLabelText(/refund/i)).not.toBeInTheDocument();
	});

	it("needs a reason, then cancels and refunds after confirming", async () => {
		const user = userEvent.setup();
		render(<OrderActionsPanel order={order} />);
		await user.click(screen.getByLabelText(/refund ₦4,000/i));
		await user.click(screen.getByRole("button", { name: "Cancel order" }));
		await screen.findByText("Cancel this order?");

		const dialogConfirm = screen.getAllByRole("button", { name: "Cancel order" }).at(-1)!;
		await user.click(dialogConfirm);
		expect(cancelOrder).not.toHaveBeenCalled();

		await user.type(screen.getByLabelText(/reason/i), "Vendor closed early");
		await user.click(dialogConfirm);
		expect(cancelOrder).toHaveBeenCalledWith(
			{ id: "order-1", reason: "Vendor closed early", refund: true },
			expect.anything(),
		);
	});

	it("adds a trimmed internal note", async () => {
		const user = userEvent.setup();
		render(<OrderNotesPanel orderId="order-1" />);
		expect(screen.getByText("Vendor called")).toBeInTheDocument();
		await user.type(screen.getByLabelText("Add a note"), "  Refund promised  ");
		await user.click(screen.getByRole("button", { name: "Add note" }));
		expect(addNote).toHaveBeenCalledWith(
			{ id: "order-1", text: "Refund promised" },
			expect.anything(),
		);
	});
});
