// src/utils/auth.ts

"use client";

import { getSession } from "next-auth/react";

export const AUTH_TOKEN_KEY = "token";
// Last time the dashboard was used (epoch ms), for the 48h away logout
export const LAST_ACTIVE_KEY = "gohive-admin-last-active";
const SESSION_CACHE_TTL = 60_000;

let cachedSessionToken: string | null = null;
let cachedAt = 0;

export async function getAuthToken(): Promise<string | null> {
	// Fast path: localStorage avoids a network/session lookup per request.
	if (typeof window !== "undefined") {
		const localToken = localStorage.getItem(AUTH_TOKEN_KEY);
		if (localToken) return localToken;
	}

	if (cachedSessionToken && Date.now() - cachedAt < SESSION_CACHE_TTL) {
		return cachedSessionToken;
	}

	const session = await getSession();
	if (session?.user && "backendToken" in session.user) {
		cachedSessionToken = (session.user as { backendToken: string }).backendToken;
		cachedAt = Date.now();
		return cachedSessionToken;
	}

	return null;
}

export function setAuthToken(token: string) {
	if (typeof window !== "undefined") {
		localStorage.setItem(AUTH_TOKEN_KEY, token);
		localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
	}
	cachedSessionToken = token;
	cachedAt = Date.now();
}

// ✅ Crucial for logout
export function clearAuth() {
	if (typeof window !== "undefined") {
		localStorage.removeItem(AUTH_TOKEN_KEY);
		localStorage.removeItem(LAST_ACTIVE_KEY);
	}
	cachedSessionToken = null;
	cachedAt = 0;
}
