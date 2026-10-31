// Suspend: the account is only suspended after a reason is given and confirmed.
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UserManagementActionModal from "@/components/_modals/UserManagementActionModal";

const mutateAsync = vi.fn();
const onClose = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@iconify/react", () => ({ Icon: () => null }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/hooks/userManagement", () => ({
	useUpdateAccountStatus: () => ({ mutateAsync, isPending: false }),
	useCustomer: () => ({
		data: { data: { name: "Ada", accountStatus: "Active" } },
		isLoading: false,
	}),
	useVendor: () => ({ data: undefined, isLoading: false }),
	useRider: () => ({ data: undefined, isLoading: false }),
}));

const openSuspend = async () => {
	const user = userEvent.setup();
	render(<UserManagementActionModal isOpen onClose={onClose} userType="customer" userId="u1" />);
	await user.click(screen.getByRole("button", { name: /suspend account/i }));
	await screen.findByText("Suspend account?");
	return user;
};

describe("suspend", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("refuses to suspend without a reason", async () => {
		const user = await openSuspend();
		await user.click(screen.getByRole("button", { name: "Suspend" }));
		expect(screen.getByText("Please give a reason.")).toBeInTheDocument();
		expect(mutateAsync).not.toHaveBeenCalled();
	});

	it("suspends with the trimmed reason and closes", async () => {
		mutateAsync.mockResolvedValue({});
		const user = await openSuspend();
		await user.type(screen.getByLabelText("Reason"), "  Repeated chargebacks  ");
		await user.click(screen.getByRole("button", { name: "Suspend" }));
		expect(mutateAsync).toHaveBeenCalledWith({
			userId: "u1",
			status: "Suspend",
			reason: "Repeated chargebacks",
		});
		await waitFor(() => expect(onClose).toHaveBeenCalled());
	});

	it("keeps the dialog open when the request fails", async () => {
		mutateAsync.mockRejectedValue(new Error("nope"));
		const user = await openSuspend();
		await user.type(screen.getByLabelText("Reason"), "Fraud");
		await user.click(screen.getByRole("button", { name: "Suspend" }));
		await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByText("Suspend account?")).toBeInTheDocument();
	});
});
