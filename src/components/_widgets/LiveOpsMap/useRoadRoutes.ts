// src/components/_widgets/LiveOpsMap/useRoadRoutes.ts
// Road routes (Google Directions) for the trips on the live map, so a rider's
// way to the vendor and the customer follows the streets, never a straight line.

"use client";

import { useEffect, useRef, useState } from "react";
import { type LatLng } from "@/types/ops";

export type Trip = {
	// Changes whenever the route needs fetching again (see tripKey).
	key: string;
	// Rider (if any) → vendor (if not picked up yet) → customer.
	stops: LatLng[];
};

// ~100 m grid: a rider moving down the street keeps the same key, so we only
// ask Google again once they've moved noticeably.
const round = (point: LatLng) => `${point.lat.toFixed(3)},${point.lng.toFixed(3)}`;
export const tripKey = (id: string, stops: LatLng[]) => `${id}|${stops.map(round).join(";")}`;
const tripId = (key: string) => key.split("|")[0] ?? key;

// Most routes we keep at once; older ones are dropped.
const MAX_CACHED = 200;
// Most trips we ask Google about at a time.
const MAX_TRIPS = 15;
// A route Google refused is asked for again after this long.
const RETRY_AFTER_MS = 60 * 1000;

/**
 * Returns a road path per trip key. While a trip's new route loads, its last
 * road route is returned instead, so the line doesn't vanish as the rider moves.
 * A trip with no road route yet is missing from the result and gets no line.
 */
export function useRoadRoutes(trips: Trip[], isLoaded: boolean) {
	const cache = useRef(new Map<string, LatLng[]>());
	// Last road route per order, shown while the next one loads.
	const lastById = useRef(new Map<string, LatLng[]>());
	const failedAt = useRef(new Map<string, number>());
	const pending = useRef(new Set<string>());
	const [version, setVersion] = useState(0);

	const wanted = trips.filter((trip) => trip.stops.length > 1).slice(0, MAX_TRIPS);
	const wantedKeys = wanted.map((trip) => trip.key).join("\n");

	useEffect(() => {
		if (!isLoaded) return undefined;
		const service = new google.maps.DirectionsService();
		let cancelled = false;
		let retryTimer: ReturnType<typeof setTimeout> | undefined;

		wanted.forEach((trip) => {
			const { key } = trip;
			if (cache.current.has(key) || pending.current.has(key)) return;
			const failed = failedAt.current.get(key);
			if (failed !== undefined && Date.now() - failed < RETRY_AFTER_MS) return;

			const [origin, ...rest] = trip.stops;
			const destination = rest[rest.length - 1];
			if (!origin || !destination) return;
			pending.current.add(key);

			service
				.route({
					origin,
					destination,
					waypoints: rest.slice(0, -1).map((location) => ({ location, stopover: true })),
					travelMode: google.maps.TravelMode.DRIVING,
				})
				.then((result) => {
					const path = result.routes[0]?.overview_path.map((point) => ({
						lat: point.lat(),
						lng: point.lng(),
					}));
					if (!path?.length) throw new Error("No route");
					failedAt.current.delete(key);
					cache.current.set(key, path);
					lastById.current.set(tripId(key), path);
					Array.from(cache.current.keys())
						.slice(0, Math.max(0, cache.current.size - MAX_CACHED))
						.forEach((oldestKey) => cache.current.delete(oldestKey));
				})
				.catch(() => {
					// Try again later (e.g. a quota blip); no straight line meanwhile.
					failedAt.current.set(key, Date.now());
					if (!cancelled && retryTimer === undefined) {
						retryTimer = setTimeout(() => setVersion((v) => v + 1), RETRY_AFTER_MS);
					}
				})
				.finally(() => {
					pending.current.delete(key);
					if (!cancelled) setVersion((v) => v + 1);
				});
		});

		return () => {
			cancelled = true;
			if (retryTimer !== undefined) clearTimeout(retryTimer);
		};
		// wantedKeys stands in for `wanted`: refetch only when a trip key changes,
		// or when a retry is due (version).
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoaded, wantedKeys, version]);

	const routes = new Map<string, LatLng[]>();
	wanted.forEach((trip) => {
		const path = cache.current.get(trip.key) ?? lastById.current.get(tripId(trip.key));
		if (path) routes.set(trip.key, path);
	});
	return routes;
}
