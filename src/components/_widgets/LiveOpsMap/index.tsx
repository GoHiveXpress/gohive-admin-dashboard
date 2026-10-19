// src/components/_widgets/LiveOpsMap/index.tsx
// Riders on shift and active orders on one map. Data: GET /admin/ops/map;
// rider positions move live over the "admin:rider_location" socket event
// (see useOpsLiveUpdates), orders refresh on "admin:orders_changed".

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, InfoWindow, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNow, useOpsMap } from "@/hooks/useOps";
import { type LatLng, type OpsMapOrder, type OpsMapRider } from "@/types/ops";

const LAGOS: LatLng = { lat: 6.5244, lng: 3.3792 };
const MINUTE = 60 * 1000;
// A rider whose last point is older than this is drawn faded.
const STALE_AFTER_MS = 10 * MINUTE;

const COLORS = {
	idle: "#22C55E",
	busy: "#3B82F6",
	stale: "#94A3B8",
	critical: "#EF4444",
	warning: "#F59E0B",
	onTime: "#64748B",
};

const containerStyle = { width: "100%", height: "100%", borderRadius: "16px" };
const mapOptions: google.maps.MapOptions = {
	disableDefaultUI: true,
	zoomControl: true,
	clickableIcons: false,
	styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
};

type Selection = { kind: "rider"; id: string } | { kind: "order"; id: string } | null;
type Layer = "all" | "riders" | "orders" | "late";

const isStale = (rider: OpsMapRider, now: number) =>
	!rider.lastLocationAt || now - new Date(rider.lastLocationAt).getTime() > STALE_AFTER_MS;

const riderColor = (rider: OpsMapRider, now: number) => {
	if (isStale(rider, now)) return COLORS.stale;
	return rider.status === "busy" || rider.activeOrderId ? COLORS.busy : COLORS.idle;
};

const orderColor = (order: OpsMapOrder) => {
	if (order.exception?.severity === "critical") return COLORS.critical;
	if (order.exception?.severity === "warning") return COLORS.warning;
	return COLORS.onTime;
};

// Where to draw an order: the customer once it's on the way, else the vendor.
const orderPoint = (order: OpsMapOrder) =>
	order.status === "picked_up"
		? (order.dropoff ?? order.pickup)
		: (order.pickup ?? order.dropoff);

const timeAgo = (iso: string | null, now: number) => {
	if (!iso) return "never";
	const minutes = Math.floor((now - new Date(iso).getTime()) / MINUTE);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes} min ago`;
	return `${Math.floor(minutes / 60)} h ago`;
};

const STATUS_LABELS: Record<string, string> = {
	placed: "Waiting for vendor",
	accepted: "Accepted",
	preparing: "Preparing",
	ready: "Ready for pickup",
	picked_up: "On the way",
};

function LegendDot({
	color,
	label,
	hollow,
	square,
}: {
	color: string;
	label: string;
	hollow?: boolean;
	square?: boolean;
}) {
	return (
		<span className="text-muted-foreground flex items-center gap-1.5 text-xs">
			<span
				className={`size-2.5 ${square ? "rounded-[2px]" : "rounded-full"}`}
				style={hollow ? { border: `2px solid ${color}` } : { backgroundColor: color }}
				aria-hidden="true"
			/>
			{label}
		</span>
	);
}

export default function LiveOpsMap({ isLive }: { isLive: boolean }) {
	const { data, isLoading, isError } = useOpsMap();
	const now = useNow(30 * 1000);
	const [layer, setLayer] = useState<Layer>("all");
	const [selection, setSelection] = useState<Selection>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const hasFitted = useRef(false);

	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
	});

	const riders = useMemo(() => data?.data.riders ?? [], [data]);
	const orders = useMemo(() => data?.data.orders ?? [], [data]);

	const placedRiders = useMemo(() => riders.filter((rider) => rider.position), [riders]);
	const placedOrders = useMemo(() => orders.filter((order) => orderPoint(order)), [orders]);
	const lateOrders = orders.filter((order) => order.exception);
	const unplacedRiders = riders.length - placedRiders.length;

	const showRiders = layer === "all" || layer === "riders";
	let visibleOrders = placedOrders;
	if (layer === "riders") visibleOrders = [];
	if (layer === "late") visibleOrders = placedOrders.filter((order) => order.exception);

	// Frame everything once, on the first load; after that the admin is in control.
	const fitToData = useCallback(() => {
		const map = mapRef.current;
		if (!map) return;
		const points: LatLng[] = [
			...placedRiders.map((rider) => rider.position!),
			...placedOrders.map((order) => orderPoint(order)!),
		];
		if (!points.length) return;
		hasFitted.current = true;
		const [first] = points;
		if (points.length === 1 && first) {
			map.setCenter(first);
			map.setZoom(14);
			return;
		}
		const bounds = new google.maps.LatLngBounds();
		points.forEach((point) => bounds.extend(point));
		map.fitBounds(bounds, 48);
	}, [placedRiders, placedOrders]);

	useEffect(() => {
		if (isLoaded && !hasFitted.current) fitToData();
	}, [isLoaded, fitToData]);

	const selectedRider =
		selection?.kind === "rider"
			? riders.find((rider) => rider._id === selection.id)
			: undefined;
	const selectedOrder =
		selection?.kind === "order"
			? orders.find((order) => order._id === selection.id)
			: orders.find((order) => order._id === selectedRider?.activeOrderId);
	const routeRider = selectedOrder?.riderId
		? riders.find((rider) => rider._id === selectedOrder.riderId)
		: undefined;
	const route = [routeRider?.position, selectedOrder?.pickup, selectedOrder?.dropoff].filter(
		(point): point is LatLng => Boolean(point),
	);

	const layers: { key: Layer; label: string; count: number }[] = [
		{ key: "all", label: "All", count: placedRiders.length + placedOrders.length },
		{ key: "riders", label: "Riders", count: placedRiders.length },
		{ key: "orders", label: "Orders", count: placedOrders.length },
		{ key: "late", label: "Late", count: lateOrders.length },
	];

	let body: React.ReactNode;
	if (loadError) {
		body = (
			<div className="text-muted-foreground flex h-full items-center justify-center text-sm">
				Google Maps could not be loaded. Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
			</div>
		);
	} else if (isError) {
		body = (
			<div className="text-destructive flex h-full items-center justify-center text-sm">
				Couldn&apos;t load the live map.
			</div>
		);
	} else if (!isLoaded || isLoading) {
		body = <Skeleton className="size-full rounded-2xl" />;
	} else {
		body = (
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={LAGOS}
				zoom={11}
				options={mapOptions}
				onLoad={(map) => {
					mapRef.current = map;
					fitToData();
				}}
				onUnmount={() => {
					mapRef.current = null;
				}}
				onClick={() => setSelection(null)}
			>
				{visibleOrders.map((order) => (
					<Marker
						key={`order-${order._id}`}
						position={orderPoint(order)!}
						onClick={() => setSelection({ kind: "order", id: order._id })}
						title={`${order.orderId} · ${STATUS_LABELS[order.status] ?? order.status}`}
						zIndex={order.exception ? 3 : 1}
						icon={{
							path: "M -6,-6 6,-6 6,6 -6,6 z",
							scale: 1,
							fillColor: orderColor(order),
							fillOpacity: 1,
							strokeColor: "#FFFFFF",
							strokeWeight: 2,
						}}
					/>
				))}

				{showRiders &&
					placedRiders.map((rider) => {
						const stale = isStale(rider, now);
						return (
							<Marker
								key={`rider-${rider._id}`}
								position={rider.position!}
								onClick={() => setSelection({ kind: "rider", id: rider._id })}
								title={rider.name ?? "Rider"}
								zIndex={stale ? 2 : 4}
								icon={{
									path: google.maps.SymbolPath.CIRCLE,
									scale: 8,
									fillColor: riderColor(rider, now),
									fillOpacity: stale ? 0.35 : 1,
									strokeColor: stale ? COLORS.stale : "#FFFFFF",
									strokeWeight: 2,
								}}
							/>
						);
					})}

				{route.length > 1 && (
					<Polyline
						path={route}
						options={{
							strokeColor: selectedOrder ? orderColor(selectedOrder) : COLORS.busy,
							strokeOpacity: 0.8,
							strokeWeight: 3,
							geodesic: true,
						}}
					/>
				)}

				{selectedRider?.position && (
					<InfoWindow
						position={selectedRider.position}
						onCloseClick={() => setSelection(null)}
					>
						<div className="min-w-[180px] space-y-1 text-xs text-slate-700">
							<p className="text-sm font-semibold text-slate-900">
								{selectedRider.name ?? "Rider"}
							</p>
							<p>
								{selectedRider.activeOrderId ? "On an order" : "Free"}
								{selectedRider.vehicleType ? ` · ${selectedRider.vehicleType}` : ""}
							</p>
							<p>Last seen {timeAgo(selectedRider.lastLocationAt, now)}</p>
							{selectedOrder && <p>Order {selectedOrder.orderId}</p>}
							{selectedRider.phone && (
								<a
									href={`tel:${selectedRider.phone}`}
									className="text-secondary font-medium"
								>
									Call {selectedRider.phone}
								</a>
							)}
						</div>
					</InfoWindow>
				)}

				{selection?.kind === "order" && selectedOrder && orderPoint(selectedOrder) && (
					<InfoWindow
						position={orderPoint(selectedOrder)!}
						onCloseClick={() => setSelection(null)}
					>
						<div className="min-w-[200px] space-y-1 text-xs text-slate-700">
							<p className="text-sm font-semibold text-slate-900">
								{selectedOrder.orderId}
							</p>
							<p>{STATUS_LABELS[selectedOrder.status] ?? selectedOrder.status}</p>
							{selectedOrder.exception && (
								<p
									className="font-semibold"
									style={{ color: orderColor(selectedOrder) }}
								>
									{selectedOrder.exception.label} ·{" "}
									{selectedOrder.exception.minutes} min
								</p>
							)}
							{selectedOrder.vendorName && <p>Vendor: {selectedOrder.vendorName}</p>}
							<p>
								Rider:{" "}
								{routeRider?.name ?? (selectedOrder.riderId ? "Assigned" : "None")}
							</p>
							{selectedOrder.dropoffAddress && (
								<p className="text-slate-500">{selectedOrder.dropoffAddress}</p>
							)}
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		);
	}

	return (
		<div className="border-border/50 flex flex-col rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<h3 className="text-foreground text-lg font-semibold">Live map</h3>
					<span
						className={`flex items-center gap-1.5 text-xs ${isLive ? "text-green-600" : "text-muted-foreground"}`}
					>
						<span
							className={`size-2 rounded-full ${isLive ? "animate-pulse bg-green-500" : "bg-slate-300"}`}
							aria-hidden="true"
						/>
						{isLive ? "Live" : "Reconnecting"}
					</span>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{layers.map(({ key, label, count }) => (
						<button
							key={key}
							type="button"
							onClick={() => setLayer(key)}
							className={`h-8 rounded-full border px-3 text-xs font-medium transition-colors ${
								layer === key
									? "bg-secondary border-secondary text-white"
									: "border-border text-foreground hover:bg-muted"
							}`}
						>
							{label} <span className="opacity-70">{count}</span>
						</button>
					))}
					<button
						type="button"
						onClick={fitToData}
						className="border-border text-foreground hover:bg-muted flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium"
						title="Zoom to fit everything"
					>
						<Icon icon="ph:corners-out-bold" width="14" />
						Fit
					</button>
				</div>
			</div>

			<div className="h-[440px] w-full">{body}</div>

			<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-4">
					<LegendDot color={COLORS.idle} label="Rider free" />
					<LegendDot color={COLORS.busy} label="Rider on order" />
					<LegendDot color={COLORS.stale} label="No update in 10 min" hollow />
					<LegendDot color={COLORS.onTime} label="Order on time" square />
					<LegendDot color={COLORS.warning} label="Order late" square />
					<LegendDot color={COLORS.critical} label="Order critical" square />
				</div>
				{unplacedRiders > 0 && (
					<span className="text-muted-foreground text-xs">
						{unplacedRiders} online rider{unplacedRiders === 1 ? "" : "s"} not sharing a
						location
					</span>
				)}
			</div>
		</div>
	);
}
