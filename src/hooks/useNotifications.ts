// src/hooks/useNotifications.ts
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/services/notifications";
import { useToast } from "@/hooks/useToast";
import { acquireSocket, releaseSocket } from "@/hooks/useOps";
import { toast as sonnerToast } from "sonner";

// A short two-note chime made in the browser, so no sound file is needed.
// Browsers block sound until the page has been clicked once; then it plays.
const playChime = () => {
	try {
		const Ctx =
			window.AudioContext ??
			(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		[880, 1320].forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			const start = ctx.currentTime + i * 0.12;
			osc.frequency.value = freq;
			gain.gain.setValueAtTime(0.0001, start);
			gain.gain.exponentialRampToValueAtTime(0.15, start + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
			osc.connect(gain).connect(ctx.destination);
			osc.start(start);
			osc.stop(start + 0.26);
		});
		setTimeout(() => {
			ctx.close().catch(() => undefined);
		}, 800);
	} catch {
		// No sound is fine
	}
};

/**
 * New notifications arrive over the socket the moment they are created
 * (the server sends "new_notification" to each admin's own room). Refreshes the
 * bell, shows a toast and plays a chime. The 30s poll stays as a fallback.
 */
export const useLiveNotifications = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		const socket = acquireSocket();
		const seen = new Set<string>();
		const onNotification = (n: { _id?: string; title?: string; message?: string }) => {
			// The server sends each one twice (new_notification and notification)
			if (n._id) {
				if (seen.has(n._id)) return;
				seen.add(n._id);
			}
			queryClient.invalidateQueries({ queryKey: ["notifications"] }).catch(() => undefined);
			sonnerToast.info(
				n.title ?? "New notification",
				n.message ? { description: n.message } : undefined,
			);
			if (document.visibilityState === "visible") playChime();
		};
		const onConnect = () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] }).catch(() => undefined);
		};
		socket.on("new_notification", onNotification);
		socket.on("notification", onNotification);
		socket.on("connect", onConnect);
		return () => {
			socket.off("new_notification", onNotification);
			socket.off("notification", onNotification);
			socket.off("connect", onConnect);
			releaseSocket();
		};
	}, [queryClient]);
};

export const useNotifications = () => {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: () => notificationApi.getNotifications(),
		refetchInterval: 30000, // Polling every 30 seconds as a fallback
	});
};

export const useMarkAsRead = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationApi.markAsRead(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

export const useMarkAllAsRead = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: () => notificationApi.markAllAsRead(),
		onSuccess: async (data) => {
			if (data.success) {
				toast.success("All notifications marked as read");
				await queryClient.invalidateQueries({ queryKey: ["notifications"] });
			}
		},
	});
};

export const useDeleteNotification = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationApi.deleteNotification(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

export const useDeleteAllNotifications = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: () => notificationApi.deleteAllNotifications(),
		onSuccess: async (data) => {
			if (data.success) {
				toast.success("All notifications cleared");
				await queryClient.invalidateQueries({ queryKey: ["notifications"] });
			}
		},
	});
};
