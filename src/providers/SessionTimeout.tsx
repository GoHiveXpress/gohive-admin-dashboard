"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";
import { AUTH_TOKEN_KEY, LAST_ACTIVE_KEY, clearAuth, setAuthToken } from "@/utils/auth";

const INACTIVITY_LIMIT = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
// Same rule as the mobile apps: not opened for 48h means log in again
const AWAY_LIMIT = 48 * 60 * 60 * 1000;
// Backend tokens last 48h; refresh well before that while the dashboard is used
const REFRESH_INTERVAL = 6 * 60 * 60 * 1000;
const TOUCH_THROTTLE = 60 * 1000;

const hasToken = () => !!localStorage.getItem(AUTH_TOKEN_KEY);

export default function SessionTimeout({ children }: { children: React.ReactNode }) {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const lastTouchRef = useRef(0);

	const handleLogout = useCallback(async () => {
		clearAuth();
		await signOut({ callbackUrl: "/", redirect: true });
	}, []);

	const touch = useCallback(() => {
		const now = Date.now();
		if (now - lastTouchRef.current < TOUCH_THROTTLE) return;
		lastTouchRef.current = now;
		if (hasToken()) localStorage.setItem(LAST_ACTIVE_KEY, String(now));
	}, []);

	const resetTimer = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			handleLogout().catch(() => undefined);
		}, INACTIVITY_LIMIT);
		touch();
	}, [handleLogout, touch]);

	// On open: sign out if the dashboard was away for 48h, else get a fresh token
	useEffect(() => {
		if (!hasToken()) return undefined;
		const lastActive = Number(localStorage.getItem(LAST_ACTIVE_KEY));
		if (lastActive && Date.now() - lastActive > AWAY_LIMIT) {
			handleLogout().catch(() => undefined);
			return undefined;
		}

		const refresh = async () => {
			if (!hasToken()) return;
			try {
				const res = await axiosInstance.post<{ success: boolean; token?: string }>(
					"/auth/refresh",
					{ app: "admin" },
				);
				if (res.data?.success && res.data.token && hasToken()) {
					setAuthToken(res.data.token);
				}
			} catch {
				// Network errors keep the current token; a real 401 is handled by axiosInstance
			}
		};

		refresh().catch(() => undefined);
		const interval = setInterval(() => {
			refresh().catch(() => undefined);
		}, REFRESH_INTERVAL);
		return () => clearInterval(interval);
	}, [handleLogout]);

	useEffect(() => {
		// Events to track user activity
		const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

		// Initial timer setup
		resetTimer();

		// Add event listeners
		events.forEach((event) => {
			window.addEventListener(event, resetTimer);
		});

		// Cleanup
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
			events.forEach((event) => {
				window.removeEventListener(event, resetTimer);
			});
		};
	}, [resetTimer]);

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{children}</>;
}
