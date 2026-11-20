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
import { CITIES_BOUNDS, SERVICE_AREA_MAP_OPTIONS, SERVICE_CENTER } from "@/constants/serviceArea";
import { tripKey, useRoadRoutes } from "./useRoadRoutes";

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
	...SERVICE_AREA_MAP_OPTIONS,
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

// ---- Marker artwork ---------------------------------------------------------
// Markers are small SVGs (data URLs) so the map reads like a delivery app:
// riders are a scooter-with-box badge, orders are pins showing the shop
// (waiting for pickup) or the house (on the way to the customer). The legend
// renders the very same images, so the two can never drift apart.

// Delivery scooter with a box on the back, drawn on a 24×24 grid.
const scooterGlyph = (color: string) => `
	<rect x="3.5" y="5.5" width="6.5" height="5.5" rx="1" fill="${color}"/>
	<path d="M6 16h4.5l2.8-5h3.4l1.3 5" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
	<path d="M15.6 11l-1.1-3.8h2.6" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
	<circle cx="6" cy="16.5" r="2.6" fill="none" stroke="${color}" stroke-width="1.8"/>
	<circle cx="18" cy="16.5" r="2.6" fill="none" stroke="${color}" stroke-width="1.8"/>`;

const shopGlyph = (color: string) => `
	<path d="M4 9.5 5.3 5h13.4L20 9.5z" fill="${color}"/>
	<path d="M5.5 10.5v8.5h13v-8.5" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
	<rect x="10" y="13.5" width="4" height="5.5" rx=".6" fill="${color}"/>`;

const houseGlyph = (color: string) => `
	<path d="M3.5 11.2 12 4l8.5 7.2" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
	<path d="M6 10v9.5h12V10" fill="none" stroke="${color}" stroke-width="1.9" stroke-linejoin="round"/>
	<rect x="10.2" y="13.5" width="3.6" height="6" rx=".6" fill="${color}"/>`;

const toDataUrl = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const RIDER_SIZE = 40;
const PIN_W = 34;
const PIN_H = 44;

// Round badge: coloured disc, white ring, white scooter, soft ground shadow.
function riderSvg(color: string, stale: boolean) {
	return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="${RIDER_SIZE}" height="${RIDER_SIZE}" viewBox="0 0 40 40">
	<ellipse cx="20" cy="36" rx="10" ry="2.5" fill="#0f172a" opacity="${stale ? 0.08 : 0.18}"/>
	<g opacity="${stale ? 0.55 : 1}">
		<circle cx="20" cy="19" r="15" fill="#fff"/>
		<circle cx="20" cy="19" r="12.5" fill="${stale ? "#fff" : color}" stroke="${color}" stroke-width="${stale ? 2 : 0}" stroke-dasharray="${stale ? "3 2.5" : "0"}"/>
		<g transform="translate(9.5 8.5) scale(.875)">${scooterGlyph(stale ? color : "#fff")}</g>
	</g>
</svg>`);
}

// Teardrop pin with a white face holding the shop / house glyph.
function orderSvg(color: string, kind: "shop" | "house") {
	const glyph = kind === "shop" ? shopGlyph(color) : houseGlyph(color);
	return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W}" height="${PIN_H}" viewBox="0 0 34 44">
	<ellipse cx="17" cy="41.5" rx="6" ry="2" fill="#0f172a" opacity=".22"/>
	<path d="M17 41C17 41 3 26.5 3 16a14 14 0 0 1 28 0c0 10.5-14 25-14 25z" fill="${color}" stroke="#fff" stroke-width="2"/>
	<circle cx="17" cy="16" r="9.5" fill="#fff"/>
	<g transform="translate(9.8 8.8) scale(.6)">${glyph}</g>
</svg>`);
}

// Where the order pin sits tells you which end of the trip it is.
const orderKind = (order: OpsMapOrder): "shop" | "house" =>
	order.status === "picked_up" && order.dropoff ? "house" : "shop";

const riderIcon = (rider: OpsMapRider, now: number): google.maps.Icon => ({
	url: riderSvg(riderColor(rider, now), isStale(rider, now)),
	scaledSize: new google.maps.Size(RIDER_SIZE, RIDER_SIZE),
	anchor: new google.maps.Point(RIDER_SIZE / 2, 19),
});

const pinIcon = (color: string, kind: "shop" | "house"): google.maps.Icon => ({
	url: orderSvg(color, kind),
	scaledSize: new google.maps.Size(PIN_W, PIN_H),
	anchor: new google.maps.Point(PIN_W / 2, 41),
});

function LegendItem({ src, label, wide }: { src: string; label: string; wide?: boolean }) {
	return (
		<span className="text-muted-foreground flex items-center gap-1.5 text-xs">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={src} alt="" aria-hidden="true" className={wide ? "size-6" : "h-6 w-[19px]"} />
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
	const unplacedRiders = riders.filter((rider) => !rider.position);
	const [showUnplaced, setShowUnplaced] = useState(false);

	const showRiders = layer === "all" || layer === "riders";
	let visibleOrders = placedOrders;
	if (layer === "riders") visibleOrders = [];
	if (layer === "late") visibleOrders = placedOrders.filter((order) => order.exception);

	// Frame Offa and Ijagbo once, on the first load; after that the admin is in control.
	const fitToData = useCallback(() => {
		const map = mapRef.current;
		if (!map) return;
		hasFitted.current = true;
		map.fitBounds(CITIES_BOUNDS, 16);
	}, []);

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

	// Every rider out on an order gets their route drawn: rider → vendor (until
	// picked up) → customer. The selected order is drawn even with no rider yet.
	const ridersById = new Map(riders.map((rider) => [rider._id, rider]));
	const tripOrders = visibleOrders.filter(
		(order) => order.riderId && ridersById.get(order.riderId)?.position,
	);
	if (selectedOrder && !tripOrders.includes(selectedOrder)) tripOrders.push(selectedOrder);
	const trips = tripOrders.map((order) => {
		const rider = order.riderId ? ridersById.get(order.riderId) : undefined;
		const stops = [
			rider?.position,
			order.status === "picked_up" ? null : order.pickup,
			order.dropoff,
		].filter((point): point is LatLng => Boolean(point));
		return { order, key: tripKey(order._id, stops), stops };
	});
	const roadRoutes = useRoadRoutes(trips, isLoaded);

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
				center={SERVICE_CENTER}
				zoom={13}
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
						icon={pinIcon(orderColor(order), orderKind(order))}
					/>
				))}

				{/* The other end of the selected trip, so the whole journey is visible. */}
				{selectedOrder &&
					(() => {
						const shown = orderKind(selectedOrder);
						const other =
							shown === "shop" ? selectedOrder.dropoff : selectedOrder.pickup;
						if (!other) return null;
						return (
							<Marker
								key={`order-end-${selectedOrder._id}`}
								position={other}
								title={
									shown === "shop"
										? "Customer"
										: (selectedOrder.vendorName ?? "Vendor")
								}
								zIndex={5}
								icon={pinIcon(
									orderColor(selectedOrder),
									shown === "shop" ? "house" : "shop",
								)}
							/>
						);
					})()}

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
								icon={riderIcon(rider, now)}
							/>
						);
					})}

				{trips.map(({ order, key, stops }) => {
					if (stops.length < 2) return null;
					const selected = order._id === selectedOrder?._id;
					const color = order.exception ? orderColor(order) : COLORS.busy;
					const road = roadRoutes.get(key);
					// Only real road routes: no line until Google has one.
					if (!road) return null;
					// Road route, drawn like turn-by-turn navigation: white casing under a
					// coloured line. Selected trip is bolder and on top.
					return [
						<Polyline
							key={`trip-casing-${key}`}
							path={road}
							options={{
								strokeColor: "#FFFFFF",
								strokeOpacity: selected ? 1 : 0.7,
								strokeWeight: selected ? 9 : 6,
								zIndex: selected ? 2 : 1,
								clickable: false,
							}}
						/>,
						<Polyline
							key={`trip-line-${key}`}
							path={road}
							onClick={() => setSelection({ kind: "order", id: order._id })}
							options={{
								strokeColor: color,
								strokeOpacity: selected ? 1 : 0.55,
								strokeWeight: selected ? 5 : 3,
								zIndex: selected ? 2 : 1,
							}}
						/>,
					];
				})}

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
						title="Show Offa and Ijagbo"
					>
						<Icon icon="ph:corners-out-bold" width="14" />
						Fit
					</button>
				</div>
			</div>

			<div className="h-[440px] w-full">{body}</div>

			<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-4">
					<LegendItem wide src={riderSvg(COLORS.idle, false)} label="Rider free" />
					<LegendItem wide src={riderSvg(COLORS.busy, false)} label="Rider on order" />
					<LegendItem
						wide
						src={riderSvg(COLORS.stale, true)}
						label="No update in 10 min"
					/>
					<LegendItem src={orderSvg(COLORS.onTime, "shop")} label="At vendor" />
					<LegendItem src={orderSvg(COLORS.onTime, "house")} label="To customer" />
					<LegendItem src={orderSvg(COLORS.warning, "shop")} label="Late" />
					<LegendItem src={orderSvg(COLORS.critical, "shop")} label="Critical" />
				</div>
				{unplacedRiders.length > 0 && (
					<button
						type="button"
						onClick={() => setShowUnplaced((open) => !open)}
						className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs underline-offset-2 hover:underline"
						aria-expanded={showUnplaced}
					>
						{unplacedRiders.length} online rider
						{unplacedRiders.length === 1 ? "" : "s"} with no location yet
						<Icon icon={showUnplaced ? "ph:caret-up" : "ph:caret-down"} width="12" />
					</button>
				)}
			</div>

			{showUnplaced && unplacedRiders.length > 0 && (
				<div className="border-border mt-3 rounded-xl border p-3">
					<p className="text-muted-foreground mb-2 text-xs">
						Marked online, but their phone has never sent a location. Usually location
						permission is off, or the app was closed without going offline.
					</p>
					<ul className="space-y-1.5">
						{unplacedRiders.map((rider) => (
							<li
								key={rider._id}
								className="flex items-center justify-between gap-3 text-xs"
							>
								<span className="text-foreground font-medium">
									{rider.name ?? "Unnamed rider"}
									<span className="text-muted-foreground font-normal">
										{" "}
										· {rider.status === "busy" ? "on an order" : "online"}
									</span>
								</span>
								{rider.phone && (
									<a
										href={`tel:${rider.phone}`}
										className="text-secondary font-medium"
									>
										Call {rider.phone}
									</a>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
