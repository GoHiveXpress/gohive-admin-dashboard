// src/lib/nextAuthOptions.ts
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const adminApiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "http://localhost:5000/api";

const nextAuthSecret =
	process.env.NEXTAUTH_SECRET ??
	(process.env.NODE_ENV !== "production" ? "dev-nextauth-secret-change-me" : undefined);

type AdminProfile = {
	id: string;
	name?: string;
	email?: string;
	role: string;
};

// Asks the backend who the token belongs to, so the session's role always
// comes from the server and never from what the browser sent.
async function fetchAdminProfile(backendToken: string): Promise<AdminProfile | null> {
	try {
		const { data } = await axios.get<{
			success: boolean;
			data?: { _id?: string; name?: string; email?: string; role?: string };
		}>(`${adminApiBaseUrl}/admin/profile`, {
			headers: { Authorization: `Bearer ${backendToken}` },
			timeout: 10_000,
		});
		const admin = data.data;
		if (!data.success || !admin?._id) return null;
		if (admin.role !== "superadmin" && admin.role !== "staff") return null;
		return { id: admin._id, name: admin.name, email: admin.email, role: admin.role };
	} catch {
		return null;
	}
}

// eslint-disable-next-line import/prefer-default-export
export const nextAuthOptions: NextAuthConfig = {
	secret: nextAuthSecret,
	// Rolling 48h session, matching the backend token: each visit extends it,
	// so it only ends after 48h without opening the dashboard
	session: { strategy: "jwt", maxAge: 48 * 60 * 60, updateAge: 60 * 60 },
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				// The token the backend returned after the password and 2FA code
				backendToken: { label: "backendToken", type: "text" },
			},
			async authorize(credentials) {
				const backendToken =
					typeof credentials?.backendToken === "string" ? credentials.backendToken : "";
				if (!backendToken) return null;

				const profile = await fetchAdminProfile(backendToken);
				if (!profile) return null;
				return { ...profile, backendToken };
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (user) {
				const u = user as { backendToken?: string; role?: string };
				// eslint-disable-next-line no-param-reassign
				token.backendToken = u.backendToken;
				// eslint-disable-next-line no-param-reassign
				token.role = u.role;
			}
			// A refreshed backend token (SessionTimeout); only kept if it is valid
			// and belongs to the same admin
			if (trigger === "update") {
				const next = (session as { backendToken?: unknown } | undefined)?.backendToken;
				if (typeof next === "string" && next) {
					const profile = await fetchAdminProfile(next);
					if (profile && profile.id === token.sub) {
						// eslint-disable-next-line no-param-reassign
						token.backendToken = next;
						// eslint-disable-next-line no-param-reassign
						token.role = profile.role;
					}
				}
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					role: token.role!,
					backendToken: token.backendToken!,
				},
			};
		},
	},
	pages: { signIn: "/login" },
};
