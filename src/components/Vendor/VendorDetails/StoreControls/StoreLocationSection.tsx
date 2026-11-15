// src/components/Vendor/VendorDetails/StoreControls/StoreLocationSection.tsx
// Lets an admin correct a store's map pin (main store or a branch). Riders can
// only check in within 300 m of this pin, so a wrong one blocks every pickup.

"use client";

import { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateVendorLocation } from "@/hooks/useAccountTools";
import { type GeoPoint, type VendorUser } from "@/types/vendorManagement";

type LatLng = { lat: number; lng: number };

// Offa, Kwara: where the map opens when a store has no pin yet
const DEFAULT_CENTER: LatLng = { lat: 8.1491, lng: 4.7208 };
const MAIN = "main";

const toLatLng = (point?: GeoPoint): LatLng | null => {
	const lng = point?.coordinates?.[0];
	const lat = point?.coordinates?.[1];
	if (typeof lat !== "number" || typeof lng !== "number") return null;
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	if (lat === 0 && lng === 0) return null;
	return { lat, lng };
};

// Accepts "8.1491, 4.7208" or a Google Maps link containing @lat,lng or q=lat,lng
const parsePasted = (text: string): LatLng | null => {
	const match = text.match(/(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
	if (!match) return null;
	const lat = Number(match[1]);
	const lng = Number(match[2]);
	if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
	return { lat, lng };
};

const metresBetween = (a: LatLng, b: LatLng) => {
	const rad = (d: number) => (d * Math.PI) / 180;
	const dLat = rad(b.lat - a.lat);
	const dLng = rad(b.lng - a.lng);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const formatMetres = (m: number) =>
	m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;

export default function StoreLocationSection({
	vendor,
	canEdit,
}: {
	vendor: VendorUser;
	canEdit: boolean;
}) {
	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
	});
	const save = useUpdateVendorLocation(vendor._id);

	const mainStore = useMemo(
		() => ({
			id: MAIN,
			label: "Main store",
			address: vendor.location?.address ?? vendor.vendorProfile.businessAddress ?? "",
			pin: toLatLng(vendor.location),
		}),
		[vendor],
	);
	const stores = useMemo(
		() => [
			mainStore,
			...(vendor.vendorProfile.branches ?? []).map((branch) => ({
				id: branch._id,
				label: branch.name ?? "Branch",
				address: branch.address ?? "",
				pin: toLatLng(branch.location),
			})),
		],
		[mainStore, vendor],
	);

	const [storeId, setStoreId] = useState(MAIN);
	const store = stores.find((s) => s.id === storeId) ?? mainStore;
	const [pin, setPin] = useState<LatLng | null>(store.pin);
	const [address, setAddress] = useState(store.address);
	const [pasted, setPasted] = useState("");
	const [reason, setReason] = useState("");

	useEffect(() => {
		setPin(store.pin);
		setAddress(store.address);
		setPasted("");
	}, [store]);

	const moved = pin && store.pin ? metresBetween(store.pin, pin) : null;
	const changed = !!pin && (!store.pin || (moved ?? 0) > 1 || address.trim() !== store.address);
	const reasonOk = reason.trim().length >= 3;

	const usePasted = () => {
		const point = parsePasted(pasted);
		if (point) setPin(point);
	};

	const submit = () => {
		if (!pin || !reasonOk) return;
		save.mutateAsync({
			latitude: Number(pin.lat.toFixed(6)),
			longitude: Number(pin.lng.toFixed(6)),
			...(address.trim() ? { address: address.trim() } : {}),
			...(storeId !== MAIN ? { branchId: storeId } : {}),
			reason: reason.trim(),
		})
			.then(() => setReason(""))
			.catch(() => undefined);
	};

	return (
		<section className="border-border/50 space-y-4 rounded-[20px] border bg-white p-6 shadow-sm">
			<div>
				<h3 className="text-foreground text-lg font-semibold">Store location</h3>
				<p className="text-muted-foreground text-sm">
					Riders can only tap &quot;I have arrived&quot; within 300 m of this pin. Drag
					the pin onto the shop&apos;s front door, or paste the coordinates the vendor
					shares from their phone. Open orders from this store get the new pin too.
				</p>
			</div>

			{stores.length > 1 && (
				<div className="flex flex-wrap gap-2">
					{stores.map((s) => (
						<Button
							key={s.id}
							size="sm"
							variant={s.id === storeId ? "default" : "outline"}
							onClick={() => setStoreId(s.id)}
						>
							{s.label}
						</Button>
					))}
				</div>
			)}

			{!store.pin && (
				<p className="bg-destructive/5 border-destructive/20 text-destructive rounded-xl border p-3 text-sm">
					This store has no pin, so riders aren&apos;t checked at pickup. Set one below.
				</p>
			)}

			<div className="h-[360px] overflow-hidden rounded-xl border">
				{loadError && (
					<p className="text-destructive p-4 text-sm">The map couldn&apos;t load.</p>
				)}
				{isLoaded && (
					<GoogleMap
						mapContainerStyle={{ width: "100%", height: "100%" }}
						center={pin ?? store.pin ?? DEFAULT_CENTER}
						zoom={pin ? 17 : 13}
						onClick={(e) => {
							if (!canEdit || !e.latLng) return;
							setPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
						}}
						options={{
							streetViewControl: false,
							mapTypeControl: true,
							clickableIcons: false,
						}}
					>
						{store.pin && pin && moved !== null && moved > 1 && (
							<Marker position={store.pin} opacity={0.4} title="Current saved pin" />
						)}
						{pin && (
							<Marker
								position={pin}
								draggable={canEdit}
								onDragEnd={(e) => {
									if (e.latLng)
										setPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
								}}
							/>
						)}
					</GoogleMap>
				)}
			</div>

			<div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
				<span>{pin ? `${pin.lat.toFixed(6)}, ${pin.lng.toFixed(6)}` : "No pin yet"}</span>
				{moved !== null && moved > 1 && (
					<span>Moved {formatMetres(moved)} from the saved pin</span>
				)}
				{pin && (
					<a
						className="text-primary underline"
						href={`https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`}
						target="_blank"
						rel="noreferrer"
					>
						Open in Google Maps
					</a>
				)}
			</div>

			{canEdit && (
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="pin-paste">Paste coordinates or a Google Maps link</Label>
						<div className="flex gap-2">
							<Input
								id="pin-paste"
								value={pasted}
								onChange={(e) => setPasted(e.target.value)}
								placeholder="8.149100, 4.720800"
							/>
							<Button
								variant="outline"
								onClick={usePasted}
								disabled={!parsePasted(pasted)}
							>
								Use
							</Button>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="pin-address">Address (optional)</Label>
						<Input
							id="pin-address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							maxLength={300}
						/>
					</div>
					<div className="space-y-2 md:col-span-2">
						<Label htmlFor="pin-reason">Reason (kept in the audit log)</Label>
						<Textarea
							id="pin-reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							maxLength={500}
							rows={2}
							placeholder="e.g. Pin was 3 km off; vendor shared live location from the shop"
							className="resize-none rounded-xl"
						/>
					</div>
					<div className="flex justify-end md:col-span-2">
						<Button onClick={submit} disabled={!changed || !reasonOk || save.isPending}>
							{save.isPending ? "Saving…" : "Save location"}
						</Button>
					</div>
				</div>
			)}
		</section>
	);
}
