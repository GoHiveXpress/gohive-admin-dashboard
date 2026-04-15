// src/lib/nextAuthOptions.ts
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
// eslint-disable-next-line import/no-named-as-default
import env from "@src/env";

// eslint-disable-next-line import/prefer-default-export
export const nextAuthOptions: NextAuthConfig = {
	secret: env.NEXTAUTH_SECRET,
	session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				// Standard Login
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
				// OTP Login Flow
				otp: { label: "OTP", type: "text" },
				isOtpFlow: { label: "isOtpFlow", type: "text" },
			},
			async authorize(credentials) {
				try {
					type ApiResponse = {
						success: boolean;
						message?: string;
						token?: string;
						user?: {
							_id?: string;
							id?: string;
							name?: string;
							email?: string;
							role?: string;
						};
					};

					let data: ApiResponse;

					// --- CASE 1: VERIFY OTP (Admin) ---
					if (
						credentials?.isOtpFlow === "true" &&
						credentials?.otp &&
						credentials?.email
					) {
						const response = await axios.post<ApiResponse>(
							`${env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/auth/verify-otp`,
							{ email: credentials.email, otp: credentials.otp },
						);
						data = response.data;
					}
					// --- CASE 2: STANDARD LOGIN (or initial Admin check) ---
					else if (credentials?.email && credentials?.password) {
						const response = await axios.post<ApiResponse>(
							`${env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/auth/login`,
							{ email: credentials.email, password: credentials.password },
						);
						data = response.data;
					} else {
						throw new Error("Missing credentials");
					}

					if (!data.success) throw new Error(data.message ?? "Login failed");

					// NOTE: If the backend says "requireOtp", authorize() will technically succeed
					// if we return an object, but we won't have a token.
					// *However*, we are handling the "first step" of admin login via
					// the React Hook (useAdminLogin) in the UI, so authorize() is only
					// called when we actually have a token to give (OTP verify or Standard login).

					if (!data.token) {
						return null; // Don't create session if no token
					}

					return {
						id: data.user?._id ?? data.user?.id,
						name: data.user?.name,
						email: data.user?.email,
						role: data.user?.role,
						backendToken: data.token,
					};
				} catch (error: unknown) {
					const err = error as { response?: { data?: unknown }; message?: string };
					console.error("Auth Error:", err?.response?.data ?? err.message);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const u = user as { backendToken?: string; role?: string };
				// eslint-disable-next-line no-param-reassign
				token.backendToken = u.backendToken;
				// eslint-disable-next-line no-param-reassign
				token.role = u.role;
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					role: token.role as string,
					backendToken: token.backendToken as string,
				},
			};
		},
	},
	pages: { signIn: "/login" },
};
