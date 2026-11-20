"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { Icon } from "@iconify/react";
import { CITIES_BOUNDS, SERVICE_AREA_MAP_OPTIONS, SERVICE_CENTER } from "@/constants/serviceArea";

const containerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "20px",
};

const ACTIVE_STATUSES = ["placed", "accepted", "preparing", "ready", "picked_up"];

type Coordinates = {
	lat: number;
	lng: number;
};

// Extracted route data for rendering
type RoutePair = {
	id: string;
	pickup: Coordinates;
	delivery: Coordinates;
	status: string;
};

interface GoogleRoutesMapProps {
	// Order objects from the backend; read defensively, shapes vary by endpoint.
	orders: readonly unknown[];
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
	value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;

const toNumber = (value: unknown): number | undefined => {
	const n = typeof value === "string" ? Number(value) : value;
	return typeof n === "number" && Number.isFinite(n) && n !== 0 ? n : undefined;
};

const toText = (value: unknown): string => (typeof value === "string" ? value : "");

// Reads [lng, lat] coordinates, or lat/lng fields, from an address-like object.
const readPoint = (...sources: unknown[]): Coordinates | null => {
	const points = sources.map((source) => {
		const record = asRecord(source);
		if (!record) return null;
		const coords = Array.isArray(record.coordinates) ? (record.coordinates as unknown[]) : [];
		const lat = toNumber(coords[1]) ?? toNumber(record.lat);
		const lng = toNumber(coords[0]) ?? toNumber(record.lng);
		return lat !== undefined && lng !== undefined ? { lat, lng } : null;
	});
	return points.find((point) => point !== null) ?? null;
};

// Pickup (vendor) and delivery (customer) points of an order, if it has both.
const extractCoordinates = (value: unknown): RoutePair | null => {
	const order = asRecord(value);
	if (!order) return null;
	const vendorProfile = asRecord(asRecord(order.vendor)?.vendorProfile);
	const pickup = readPoint(vendorProfile?.storeLocation, order.pickupAddress);
	const delivery = readPoint(order.deliveryAddress);
	const id = toText(order._id) || toText(order.orderId);
	if (!pickup || !delivery || !id) return null;
	return { id, pickup, delivery, status: toText(order.status) };
};

export default function GoogleRoutesMap({ orders = [] }: GoogleRoutesMapProps) {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: apiKey,
	});

	useEffect(() => {
		if (loadError) {
			console.error("Google Maps load error:", loadError);
		}
	}, [loadError]);

	// Array to store fetched directions responses
	const [directionsResponses, setDirectionsResponses] = useState<
		{ id: string; result: google.maps.DirectionsResult }[]
	>([]);
	const [activePairs, setActivePairs] = useState<RoutePair[]>([]);

	useEffect(() => {
		if (!isLoaded) return undefined;

		const routePairs = (orders ?? []).map(extractCoordinates).filter(Boolean) as RoutePair[];

		// Show orders that are currently in progress
		const currentActivePairs = routePairs
			.filter((p) => ACTIVE_STATUSES.includes(p.status.toLowerCase()))
			.slice(0, 10);

		if (currentActivePairs.length === 0) {
			setDirectionsResponses([]);
			setActivePairs([]);
			return undefined;
		}

		setActivePairs(currentActivePairs);

		const directionsService = new window.google.maps.DirectionsService();

		const fetches = currentActivePairs.map((pair) => {
			return new Promise<{ id: string; result: google.maps.DirectionsResult } | null>(
				(resolve) => {
					directionsService
						.route(
							{
								origin: pair.pickup,
								destination: pair.delivery,
								travelMode: window.google.maps.TravelMode.DRIVING,
							},
							(result, status) => {
								if (status === window.google.maps.DirectionsStatus.OK) {
									resolve(result ? { id: pair.id, result } : null);
								} else {
									console.error(
										`Error fetching directions for order ${pair.id}: ${status}`,
									);
									resolve(null);
								}
							},
						)
						// The callback already resolves; a rejection here means no route.
						.catch(() => resolve(null));
				},
			);
		});

		let cancelled = false;
		Promise.all(fetches)
			.then((results) => {
				if (!cancelled) setDirectionsResponses(results.filter((r) => r !== null));
			})
			.catch(() => undefined);
		return () => {
			cancelled = true;
		};
	}, [isLoaded, orders]);

	if (loadError) {
		return (
			<div className="border-destructive/20 text-destructive flex h-64 w-full items-center justify-center rounded-[20px] border bg-[#F5F5F0]">
				<div>Error loading maps API</div>
			</div>
		);
	}

	if (!isLoaded) {
		return (
			<div className="border-border/20 text-muted-foreground/30 flex size-full items-center justify-center rounded-[20px] border bg-[#F5F5F0]">
				<Icon icon="line-md:loading-twotone-loop" className="size-8" />
			</div>
		);
	}

	return (
		<div className="border-border/20 relative size-full overflow-hidden rounded-[20px] border bg-[#F5F5F0]">
			{activePairs.length === 0 && (
				<div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
					<span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
						No orders in progress right now
					</span>
				</div>
			)}
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={SERVICE_CENTER}
				zoom={13}
				onLoad={(map) => map.fitBounds(CITIES_BOUNDS, 8)}
				options={{
					zoomControl: true,
					streetViewControl: false,
					mapTypeControl: false,
					fullscreenControl: false,
					...SERVICE_AREA_MAP_OPTIONS,
				}}
			>
				{directionsResponses.map(({ id, result }, index) => {
					// Alternate colors to tell routes apart
					const strokeColor = index % 2 === 0 ? "#FDB900" : "#2196F3";
					return (
						<DirectionsRenderer
							key={id}
							directions={result}
							options={{
								suppressMarkers: false,
								polylineOptions: {
									strokeOpacity: 0.8,
									strokeWeight: 4,
									strokeColor,
								},
							}}
						/>
					);
				})}

				{/* Render Custom Markers for Pickup and Delivery */}
				{activePairs.map((pair) => (
					<React.Fragment key={pair.id}>
						{/* Pickup Marker (Vendor) */}
						<Marker
							position={pair.pickup}
							label={{
								text: "P",
								color: "white",
								fontWeight: "bold",
							}}
							title="Pickup Location (Vendor)"
						/>
						{/* Delivery Marker (Customer) */}
						<Marker
							position={pair.delivery}
							label={{
								text: "D",
								color: "white",
								fontWeight: "bold",
							}}
							title="Delivery Location (Customer)"
						/>
					</React.Fragment>
				))}
			</GoogleMap>
		</div>
	);
}
