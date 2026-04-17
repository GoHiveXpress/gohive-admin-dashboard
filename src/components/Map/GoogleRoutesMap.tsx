"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { Icon } from "@iconify/react";

const containerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "20px",
};

const defaultCenter = {
	lat: 6.5244,
	lng: 3.3792, // Default to Lagos, Nigeria
};

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
	orders: any[]; // Array of order objects from the backend
}

export default function GoogleRoutesMap({ orders = [] }: GoogleRoutesMapProps) {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
	
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
	const [directionsResponses, setDirectionsResponses] = useState<(google.maps.DirectionsResult | null)[]>([]);
	const [activePairs, setActivePairs] = useState<RoutePair[]>([]);

	// Helper to extract coordinates safely from the dynamic order structure
	const extractCoordinates = (order: any): RoutePair | null => {
		try {
			// Adapt these paths based on the exact DB schema representation for admin
			const pickupLat = order?.vendor?.vendorProfile?.storeLocation?.coordinates?.[1] || order?.pickupAddress?.lat;
			const pickupLng = order?.vendor?.vendorProfile?.storeLocation?.coordinates?.[0] || order?.pickupAddress?.lng;
			
			const deliveryLat = order?.deliveryAddress?.coordinates?.[1] || order?.deliveryAddress?.lat;
			const deliveryLng = order?.deliveryAddress?.coordinates?.[0] || order?.deliveryAddress?.lng;

			if (pickupLat && pickupLng && deliveryLat && deliveryLng) {
				return {
					id: order._id || order.orderId || Math.random().toString(),
					pickup: { lat: Number(pickupLat), lng: Number(pickupLng) },
					delivery: { lat: Number(deliveryLat), lng: Number(deliveryLng) },
					status: order.status || "",
				};
			}
			return null;
		} catch (e) {
			return null;
		}
	};

	useEffect(() => {
		if (!isLoaded || !orders || orders.length === 0) return;

		const routePairs = orders
			.map(extractCoordinates)
			.filter(Boolean) as RoutePair[];
			
		// Show orders that are currently in progress
		const currentActivePairs = routePairs.filter(p => 
            ["placed", "accepted", "preparing", "ready", "picked_up"].includes(p.status.toLowerCase())
        ).slice(0, 10);

		if (currentActivePairs.length === 0) {
            setDirectionsResponses([]);
            setActivePairs([]);
            return;
        }

        setActivePairs(currentActivePairs);

		const directionsService = new window.google.maps.DirectionsService();

		const fetches = currentActivePairs.map((pair) => {
			return new Promise<google.maps.DirectionsResult | null>((resolve) => {
				directionsService.route(
					{
						origin: pair.pickup,
						destination: pair.delivery,
						travelMode: window.google.maps.TravelMode.DRIVING,
					},
					(result, status) => {
						if (status === window.google.maps.DirectionsStatus.OK) {
							resolve(result);
						} else {
							console.error(`Error fetching directions for order ${pair.id}: ${status}`);
							resolve(null);
						}
					}
				);
			});
		});

		Promise.all(fetches).then((results) => {
			setDirectionsResponses(results.filter(Boolean));
		});

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
			<div className="border-border/20 text-muted-foreground/30 flex h-64 w-full items-center justify-center rounded-[20px] border bg-[#F5F5F0]">
				<Icon icon="line-md:loading-twotone-loop" className="size-8" />
			</div>
		);
	}

	return (
		<div className="h-64 w-full overflow-hidden rounded-[20px] border border-border/20 bg-[#F5F5F0]">
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={defaultCenter}
				zoom={11}
				options={{
					zoomControl: true,
					streetViewControl: false,
					mapTypeControl: false,
					fullscreenControl: false,
				}}
			>
				{directionsResponses.map((response, index) => {
					if (!response) return null;
                    // Provide alternate colors to differentiate routes
                    const strokeColor = index % 2 === 0 ? "#FDB900" : "#2196F3"; 
					return (
						<DirectionsRenderer
							key={index}
							directions={response}
							options={{
								suppressMarkers: false,
								polylineOptions: {
									strokeOpacity: 0.8,
									strokeWeight: 4,
                                    strokeColor: strokeColor,
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
