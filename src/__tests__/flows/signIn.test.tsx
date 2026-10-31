// Sign-in: the login form either hands off to the OTP screen or opens a session.
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginForm from "@/components/_auths/LoginForm";

const push = vi.fn();
const login = vi.fn();
const signIn = vi.fn<(...args: unknown[]) => Promise<{ ok: boolean }>>();
const setAuthToken = vi.fn<(token: string) => void>();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/image", () => ({ default: () => null }));
vi.mock("next-auth/react", () => ({ signIn: (...args: unknown[]) => signIn(...args) }));
vi.mock("@/hooks/authManagement", () => ({
	useAdminLogin: () => ({ mutate: login, isPending: false }),
}));
vi.mock("@/utils/auth", () => ({ setAuthToken: (t: string) => setAuthToken(t) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

type LoginCallbacks = { onSuccess: (data: Record<string, unknown>) => void };

const fillAndSubmit = async (email = "admin@gohive.test") => {
	const user = userEvent.setup();
	await user.type(screen.getByLabelText("Email"), email);
	await user.type(screen.getByLabelText("Password"), "secret");
	await user.click(screen.getByRole("button", { name: /log in/i }));
};

describe("sign-in", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sessionStorage.clear();
	});

	it("blocks an invalid email before calling the API", async () => {
		render(<LoginForm />);
		await fillAndSubmit("not-an-email");
		expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
		expect(login).not.toHaveBeenCalled();
	});

	it("sends admins to the OTP screen with their ticket", async () => {
		login.mockImplementation((_values: unknown, { onSuccess }: LoginCallbacks) =>
			onSuccess({ requireOtp: true, otpTicket: "ticket-1" }),
		);
		render(<LoginForm />);
		await fillAndSubmit();
		expect(login).toHaveBeenCalledWith(
			{ email: "admin@gohive.test", password: "secret" },
			expect.anything(),
		);
		expect(sessionStorage.getItem("admin_login_ticket")).toBe("ticket-1");
		expect(push).toHaveBeenCalledWith("/login-verify");
		expect(signIn).not.toHaveBeenCalled();
	});

	it("opens a session and goes to the dashboard when a token comes back", async () => {
		login.mockImplementation((_values: unknown, { onSuccess }: LoginCallbacks) =>
			onSuccess({ token: "jwt" }),
		);
		signIn.mockResolvedValue({ ok: true });
		render(<LoginForm />);
		await fillAndSubmit();
		expect(setAuthToken).toHaveBeenCalledWith("jwt");
		expect(signIn).toHaveBeenCalledWith("credentials", {
			backendToken: "jwt",
			redirect: false,
		});
		await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
	});
});
