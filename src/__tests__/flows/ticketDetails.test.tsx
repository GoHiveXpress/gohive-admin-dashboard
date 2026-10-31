// Ticket details: the agent holding a chat can edit it, resolving needs an
// outcome, and other staff only see the ticket.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TicketDetails from "@/components/Support/SupportManagement/TicketTab/TicketDetails";
import { type ISupportChat } from "@/types/supportManagement";

const updateTicket = vi.fn();
const resolveTicket = vi.fn();

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/hooks/supportManagement", () => ({
	useUpdateTicket: () => ({ mutate: updateTicket, isPending: false }),
	useResolveTicket: () => ({ mutate: resolveTicket, isPending: false }),
}));

const chat = {
	_id: "chat-1",
	ticketNumber: 42,
	status: "active",
	ticketStatus: "in_progress",
	priority: "high",
	category: "late_delivery",
	createdAt: "2026-10-01T10:00:00Z",
	firstResponseAt: "2026-10-01T10:04:00Z",
	order: { _id: "o1", orderId: "GH-000123", status: "delivered", totalAmount: 4000 },
} as unknown as ISupportChat;

const now = Date.parse("2026-10-01T11:00:00Z");

describe("TicketDetails", () => {
	it("lets the agent link an order and asks for an outcome before resolving", async () => {
		const user = userEvent.setup();
		render(<TicketDetails chat={chat} canEdit now={now} />);

		expect(screen.getByText("T-00042")).toBeInTheDocument();
		expect(screen.getByText("Answered in 4m")).toBeInTheDocument();

		const orderInput = screen.getByLabelText("Linked order");
		await user.clear(orderInput);
		await user.type(orderInput, "gh-000999");
		await user.click(screen.getByRole("button", { name: "Link order" }));
		expect(updateTicket).toHaveBeenCalledWith({ id: "chat-1", orderCode: "GH-000999" });

		await user.click(screen.getByRole("button", { name: "Resolve ticket" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Resolve" })).toBeDisabled();
		expect(resolveTicket).not.toHaveBeenCalled();
	});

	it("shows other staff the ticket without controls", () => {
		render(<TicketDetails chat={chat} canEdit={false} now={now} />);

		expect(screen.getByText(/In progress · Late delivery · High priority/)).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Resolve ticket" })).not.toBeInTheDocument();
		expect(screen.queryByLabelText("Linked order")).not.toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Open GH-000123" })).toBeInTheDocument();
	});
});
