// src/hooks/useOps.ts
// Data and live updates for the operations dashboard.

"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { opsApi } from "@/app/api/ops";
import { getAuthToken } from "@/utils/auth";
import { type OpsMapResponse, type RiderLocationEvent } from "@/types/ops";

const adminApiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "http://localhost:5000/api";
const SOCKET_URL = adminApiBaseUrl.replace("/api", "");

export const OPS_EXCEPTIONS_KEY = ["ops_exceptions"];
export const OPS_KPIS_KEY = ["ops_kpis"];
export const OPS_MAP_KEY = ["ops_map"];

// Queries an order change can make stale.
const LIVE_QUERY_KEYS = [
	OPS_EXCEPTIONS_KEY,
	OPS_KPIS_KEY,
	OPS_MAP_KEY,
	["dashboardOverview"],
	["admin_orders"],
	["admin_order_stats"],
];

// Orders also become late without any write happening, so the queue is
// refetched on a timer as well as on socket events.
export const useOpsExceptions = (enabled = true) =>
	useQuery({
		queryKey: OPS_EXCEPTIONS_KEY,
		queryFn: () => opsApi.getExceptions(),
		enabled,
		refetchInterval: 30 * 1000,
		staleTime: 10 * 1000,
	});

export const useOpsKpis = (enabled = true) =>
	useQuery({
		queryKey: OPS_KPIS_KEY,
		queryFn: () => opsApi.getKpis(),
		enabled,
		refetchInterval: 2 * 60 * 1000,
		staleTime: 30 * 1000,
	});

// Rider status changes (going online/offline) don't emit events, so the map
// also refetches on a timer. Positions in between arrive over the socket.
export const useOpsMap = (enabled = true) =>
	useQuery({
		queryKey: OPS_MAP_KEY,
		queryFn: () => opsApi.getMap(),
		enabled,
		refetchInterval: 60 * 1000,
		staleTime: 15 * 1000,
	});

// Moves one rider in the cached map data without refetching.
const applyRiderLocation = (
	current: OpsMapResponse | undefined,
	event: RiderLocationEvent,
): OpsMapResponse | undefined => {
	if (!current) return current;
	let found = false;
	const riders = current.data.riders.map((rider) => {
		if (rider._id !== event.riderId) return rider;
		found = true;
		return {
			...rider,
			position: { lat: event.lat, lng: event.lng },
			lastLocationAt: event.at,
		};
	});
	// A rider we don't know yet (just came online): the next refetch adds them.
	if (!found) return current;
	return { ...current, data: { ...current.data, riders } };
};

/**
 * Joins the admin ops room (the server adds admins who can see orders) and
 * refetches dashboard data whenever orders change. Returns the connection state.
 */
export const useOpsLiveUpdates = (enabled = true) => {
	const queryClient = useQueryClient();
	const [isConnected, setIsConnected] = useState(false);
	const [lastEventAt, setLastEventAt] = useState<string | null>(null);

	useEffect(() => {
		if (!enabled) return undefined;
		const socket = io(SOCKET_URL, {
			transports: ["websocket", "polling"],
			withCredentials: true,
			// Called on every (re)connect, so a refreshed token is picked up
			auth: (cb) => {
				getAuthToken()
					.then((token) => cb({ token: token ?? "" }))
					.catch(() => cb({ token: "" }));
			},
		});

		const refresh = () => {
			LIVE_QUERY_KEYS.forEach((queryKey) => {
				queryClient.invalidateQueries({ queryKey }).catch(() => undefined);
			});
		};

		socket.on("connect", () => {
			setIsConnected(true);
			// Catch up on anything missed while disconnected
			refresh();
		});
		socket.on("disconnect", () => setIsConnected(false));
		socket.on("admin:orders_changed", (payload: { at?: string }) => {
			setLastEventAt(payload.at ?? new Date().toISOString());
			refresh();
		});
		socket.on("admin:rider_location", (event: RiderLocationEvent) => {
			queryClient.setQueryData<OpsMapResponse>(OPS_MAP_KEY, (current) =>
				applyRiderLocation(current, event),
			);
		});

		return () => {
			socket.disconnect();
		};
	}, [enabled, queryClient]);

	return { isConnected, lastEventAt };
};

// Re-renders every `intervalMs` so "late by" timers keep counting.
export const useNow = (intervalMs = 15 * 1000) => {
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
		return () => window.clearInterval(timer);
	}, [intervalMs]);
	return now;
};
