// src/utils/auth.ts

"use client";

import { getSession } from "next-auth/react";

// Last time the dashboard was used (epoch ms), for the 48h away logout
export const LAST_ACTIVE_KEY = "gohive-admin-last-active";
// Older versions kept the backend token here; it is removed on sign-out
const LEGACY_TOKEN_KEY = "token";
const SESSION_CACHE_TTL = 60_000;

// The backend token lives in the httpOnly NextAuth session cookie, never in
// localStorage. This in-memory copy only saves a session lookup per request.
let cachedSessionToken: string | null = null;
let cachedAt = 0;

export async function getAuthToken(): Promise<string | null> {
	if (cachedSessionToken && Date.now() - cachedAt < SESSION_CACHE_TTL) {
		return cachedSessionToken;
	}

	const session = await getSession();
	const token = session?.user?.backendToken ?? null;
	if (token) {
		cachedSessionToken = token;
		cachedAt = Date.now();
	}
	return token;
}

// Primes the cache right after sign-in or a token refresh
export function setAuthToken(token: string) {
	if (typeof window !== "undefined") {
		localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
	}
	cachedSessionToken = token;
	cachedAt = Date.now();
}

// ✅ Crucial for logout
export function clearAuth() {
	if (typeof window !== "undefined") {
		localStorage.removeItem(LEGACY_TOKEN_KEY);
		localStorage.removeItem(LAST_ACTIVE_KEY);
	}
	cachedSessionToken = null;
	cachedAt = 0;
}
