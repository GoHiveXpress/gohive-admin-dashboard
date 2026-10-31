"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { LAST_ACTIVE_KEY, clearAuth, setAuthToken } from "@/utils/auth";

// 30 minutes without activity in any dashboard tab signs the admin out,
// including time with the dashboard closed
const INACTIVITY_LIMIT = 30 * 60 * 1000;
const WARNING_BEFORE = 60 * 1000;
// The backend caps admin sessions at 12h from sign-in; refreshing keeps the
// token valid until then and fails with a 401 after, which signs out
const REFRESH_INTERVAL = 60 * 60 * 1000;
const TOUCH_THROTTLE = 30 * 1000;

const lastActiveAt = () => Number(localStorage.getItem(LAST_ACTIVE_KEY)) || 0;

export default function SessionTimeout({ children }: { children: React.ReactNode }) {
	const { status, update } = useSession();
	const signedIn = status === "authenticated";
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const lastTouchRef = useRef(0);
	// NextAuth makes a new `update` and flips status to "loading" on every
	// session change, so the refresh effect must not re-run on either: each
	// update would trigger another refresh, looping forever.
	const updateRef = useRef(update);
	const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		updateRef.current = update;
	}, [update]);

	const handleLogout = useCallback(async () => {
		clearAuth();
		await signOut({ callbackUrl: "/", redirect: true });
	}, []);

	const touch = useCallback(() => {
		const now = Date.now();
		if (now - lastTouchRef.current < TOUCH_THROTTLE) return;
		lastTouchRef.current = now;
		if (signedIn) localStorage.setItem(LAST_ACTIVE_KEY, String(now));
	}, [signedIn]);

	// Wakes when this tab's idle time is nearly up, then checks the activity
	// every tab records, so working in one tab keeps the others signed in.
	const schedule = useCallback(
		(delay: number) => {
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				const idleFor = Date.now() - (lastActiveAt() || lastTouchRef.current);
				if (idleFor >= INACTIVITY_LIMIT) {
					toast.dismiss("idle-warning");
					handleLogout().catch(() => undefined);
				} else if (idleFor >= INACTIVITY_LIMIT - WARNING_BEFORE) {
					toast.warning(
						"You'll be signed out in a minute because you've been inactive.",
						{
							id: "idle-warning",
							duration: WARNING_BEFORE,
						},
					);
					schedule(INACTIVITY_LIMIT - idleFor);
				} else {
					schedule(INACTIVITY_LIMIT - WARNING_BEFORE - idleFor);
				}
			}, delay);
		},
		[handleLogout],
	);

	const resetTimer = useCallback(() => {
		if (!signedIn) return;
		toast.dismiss("idle-warning");
		touch();
		schedule(INACTIVITY_LIMIT - WARNING_BEFORE);
	}, [schedule, signedIn, touch]);

	// On open: sign out if no tab was used for the idle limit, else get a fresh
	// token once, then again every REFRESH_INTERVAL. Runs once per page load.
	useEffect(() => {
		if (status === "unauthenticated" && refreshIntervalRef.current) {
			clearInterval(refreshIntervalRef.current);
			refreshIntervalRef.current = null;
		}
		if (!signedIn || refreshIntervalRef.current) return;
		const lastActive = lastActiveAt();
		if (lastActive && Date.now() - lastActive > INACTIVITY_LIMIT) {
			handleLogout().catch(() => undefined);
			return;
		}

		const refresh = async () => {
			try {
				const res = await axiosInstance.post<{ success: boolean; token?: string }>(
					"/auth/refresh",
					{ app: "admin" },
				);
				if (res.data?.success && res.data.token) {
					// The session cookie holds the token; NextAuth checks it before keeping it
					await updateRef.current({ backendToken: res.data.token });
					setAuthToken(res.data.token, { markActive: false });
				}
			} catch {
				// Network errors keep the current token; a real 401 is handled by axiosInstance
			}
		};

		refresh().catch(() => undefined);
		refreshIntervalRef.current = setInterval(() => {
			refresh().catch(() => undefined);
		}, REFRESH_INTERVAL);
	}, [handleLogout, signedIn, status]);

	useEffect(
		() => () => {
			if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
		},
		[],
	);

	useEffect(() => {
		// Events to track user activity
		const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

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
