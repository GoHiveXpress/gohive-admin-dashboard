"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";
import { clearAuth } from "@/utils/auth";

const INACTIVITY_LIMIT = 9 * 60 * 60 * 1000; // 9 hours in milliseconds

export default function SessionTimeout({ children }: { children: React.ReactNode }) {
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const handleLogout = useCallback(async () => {
		console.log("Inactivity limit reached. Logging out...");
		clearAuth();
		await signOut({ callbackUrl: "/", redirect: true });
	}, []);

	const resetTimer = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
	}, [handleLogout]);

	useEffect(() => {
		// Events to track user activity
		const events = [
			"mousedown",
			"mousemove",
			"keypress",
			"scroll",
			"touchstart",
		];

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

	return <>{children}</>;
}
