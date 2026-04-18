"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useOrders } from "@/hooks/customerManagement";
import { useRiders } from "@/hooks/riderManagement";

const containerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "16px",
};

export default function AllOrders() {
	const { data: orderResponse, isLoading: isLoadingOrders } = useOrders({});
	const { data: riderResponse, isLoading: isLoadingRiders } = useRiders();

	const orders = orderResponse?.data || [];
	const riders = riderResponse?.data || [];

	const { isLoaded: isMapLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
	});

	// Compute Order Metrics
	const { pending, enRoute, completed, delayed } = useMemo(() => {
		const result = { pending: [] as any[], enRoute: [] as any[], completed: [] as any[], delayed: [] as any[] };
		
		orders.forEach((o: any) => {
			if (["pending", "placed", "accepted"].includes(o.status)) {
				result.pending.push(o);
			} else if (["preparing", "ready", "picked_up"].includes(o.status)) {
				result.enRoute.push(o);
			} else if (["delivered"].includes(o.status)) {
				result.completed.push(o);
			} else {
				result.delayed.push(o);
			}
		});

		return result;
	}, [orders]);

	const totalOrders = pending.length + enRoute.length + completed.length + delayed.length;
	// Simplistic CSS Donut logic simulating chunks natively
	const getConicGradient = () => {
		if (totalOrders === 0) return "conic-gradient(#E5E7EB 0% 100%)";
		let start = 0;
		const cEnd = (completed.length / totalOrders) * 100;
		const rEnd = cEnd + (enRoute.length / totalOrders) * 100;
		const pEnd = rEnd + (pending.length / totalOrders) * 100;
		return `conic-gradient(#22C55E 0% ${cEnd}%, #84CC16 ${cEnd}% ${rEnd}%, #EAB308 ${rEnd}% ${pEnd}%, #EF4444 ${pEnd}% 100%)`;
	};

	// Compute Rider Metrics
	const { online, available, busy } = useMemo(() => {
		let o = 0, a = 0, b = 0;
		riders.forEach((r: any) => {
			if (r.riderProfile?.availabilityStatus === "active") a++;
			else if (r.riderProfile?.availabilityStatus === "inactive") o++;
			else b++; 
		});
		return { online: o + a + b, available: a, busy: b }; // Simplification based on typical schema mappings
	}, [riders]);

	// Display First Active En Route/Pending Order on Map seamlessly
	const targetOrder = pending[0] || enRoute[0] || null;
	const vendorLocation = { lat: 6.5244, lng: 3.3792 };
	const riderLocation = { lat: 6.5244 + 0.01, lng: 3.3792 + 0.01 };

	if (isLoadingOrders || isLoadingRiders) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="grid h-full min-h-[800px] grid-cols-1 gap-6 xl:grid-cols-3">
			{/* =======================
                COLUMN 1 
               ======================= */}
			<div className="flex h-full flex-col gap-6">
				{/* 1. ORDER QUEUE CARD */}
				<div className="border-border/50 flex flex-1 flex-col gap-4 rounded-[20px] border bg-white p-5">
					<h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
						<Icon icon="ph:circle-notch-bold" className="text-primary size-6" />
						Order Queue
					</h3>

					{/* Chart & Legend Section */}
					<div className="border-border/40 flex items-center justify-between rounded-xl border bg-white p-4">
						<div className="text-muted-foreground space-y-2 text-xs font-medium">
							<div className="flex items-center gap-2">
								<div className="size-2.5 rounded-full bg-[#EF4444]" /> Delayed ({delayed.length})
							</div>
							<div className="flex items-center gap-2">
								<div className="size-2.5 rounded-full bg-[#EAB308]" /> Confirmed order ({pending.length})
							</div>
							<div className="flex items-center gap-2">
								<div className="size-2.5 rounded-full bg-[#84CC16]" /> Pick up order ({enRoute.length})
							</div>
							<div className="flex items-center gap-2">
								<div className="size-2.5 rounded-full bg-[#22C55E]" /> Delivered order ({completed.length})
							</div>
						</div>

						{/* CSS Donut Chart */}
						<div
							className="relative size-20 rounded-full"
							style={{ background: getConicGradient() }}
						>
							<div className="absolute inset-2.5 rounded-full bg-white" />
						</div>
					</div>

					{/* Order Cards List */}
					<div className="custom-scrollbar max-h-[400px] flex-1 space-y-3 overflow-y-auto pr-1">
						{delayed.slice(0, 5).map((o: any) => (
							<div key={o._id} className="space-y-3 rounded-2xl border border-[#FECDD3] bg-[#FFF1F2] p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-2 text-xs font-semibold text-[#BE123C]">
										<div className="size-2 rounded-full bg-[#BE123C]" />
										Order ID: #{o.orderId?.slice(-6)}
									</div>
									<Icon icon="ph:copy" className="text-muted-foreground/70 hover:text-foreground size-4 cursor-pointer" />
								</div>
								<div className="text-foreground/80 space-y-1 text-xs font-medium">
									{o.items?.slice(0, 2).map((item: any, i: number) => (
										<p key={i}>{item.quantity} X {item.name}</p>
									))}
								</div>
							</div>
						))}

						{pending.slice(0, 5).map((o: any) => (
							<div key={o._id} className="space-y-3 rounded-2xl border border-[#FEF08A] bg-[#FEFCE8] p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-2 text-xs font-semibold text-[#A16207]">
										<div className="size-2 rounded-full bg-[#EAB308]" />
										Order ID: #{o.orderId?.slice(-6)}
									</div>
								</div>
								<div className="text-foreground/80 space-y-1 text-xs font-medium">
									{o.items?.slice(0, 2).map((item: any, i: number) => (
										<p key={i}>{item.quantity} X {item.name}</p>
									))}
								</div>
							</div>
						))}

						{enRoute.slice(0, 5).map((o: any) => (
							<div key={o._id} className="space-y-3 rounded-2xl border border-[#FFEDD5] bg-[#FFF7ED] p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C]">
										<div className="size-2 rounded-full bg-[#F97316]" />
										Order ID: #{o.orderId?.slice(-6)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* =======================
                COLUMN 2: RIDER STATUS
               ======================= */}
			<div className="border-border/50 flex h-full flex-col gap-6 rounded-[20px] border bg-white p-5">
				<h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
					<Icon icon="ph:circle-notch-bold" className="text-primary size-6" />
					Rider Status
				</h3>

				<div className="space-y-3">
					<div className="border-border/60 flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
						<div className="flex items-center gap-3">
							<div className="size-3 rounded-full bg-[#F97316]" />
							<span className="text-sm font-medium">Online</span>
						</div>
						<span className="text-lg font-bold">{online}</span>
					</div>

					<div className="border-border/60 flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
						<div className="flex items-center gap-3">
							<div className="size-3 rounded-full bg-[#22C55E]" />
							<span className="text-sm font-medium">Available</span>
						</div>
						<span className="text-lg font-bold">{available}</span>
					</div>

					<div className="border-border/60 flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
						<div className="flex items-center gap-3">
							<div className="size-3 rounded-full bg-[#EF4444]" />
							<span className="text-sm font-medium">Busy</span>
						</div>
						<span className="text-lg font-bold">{busy}</span>
					</div>
				</div>

				<div className="bg-border/50 h-px w-full" />

				<div className="flex flex-1 flex-col overflow-hidden">
					<h4 className="mb-4 text-base font-medium">Active Riders List</h4>
					<div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
						{riders.map((rider: any) => (
							<div
								key={rider._id}
								className="border-border/50 hover:bg-muted/30 flex items-center justify-between rounded-xl border p-3 transition-colors"
							>
								<div className="space-y-1">
									<p className="text-sm font-semibold">{rider.name}</p>
									<div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-medium">
										Status
										<div className={`size-1.5 rounded-full ${rider.riderProfile?.availabilityStatus === "active" ? "bg-[#22C55E]" : "bg-[#EF4444]"}`} />
										<span className="text-foreground capitalize">{rider.riderProfile?.availabilityStatus || "Inactive"}</span>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="outline" className="text-muted-foreground border-border h-6 rounded-md bg-white px-2 text-[10px] font-normal">
										{rider._id.slice(-6).toUpperCase()}
									</Badge>
									<Icon icon="ph:copy" className="size-4 cursor-pointer text-[#22C55E]" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* =======================
                COLUMN 3: LIVE MAP
               ======================= */}
			<div className="border-border/50 flex h-full flex-col gap-5 rounded-[20px] border bg-white p-5">
				<h3 className="text-foreground text-lg font-bold">Live Map</h3>

				<div className="border-border/50 relative min-h-[300px] flex-1 overflow-hidden rounded-2xl border bg-[#EBF0F0]">
					{!isMapLoaded ? (
						<div className="flex h-full w-full items-center justify-center rounded-2xl bg-muted/20">
							<Loader2 className="size-6 animate-spin text-muted-foreground" />
						</div>
					) : (
						<GoogleMap
							mapContainerStyle={containerStyle}
							center={vendorLocation}
							zoom={12}
							options={{
								disableDefaultUI: true,
								zoomControl: true,
								styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
							}}
						>
							<Marker
								position={vendorLocation}
								icon={{
									path: google.maps.SymbolPath.CIRCLE,
									scale: 8,
									fillColor: "#EF4444",
									fillOpacity: 1,
									strokeWeight: 2,
									strokeColor: "#FFFFFF",
								}}
							/>
							<Marker
								position={riderLocation}
								icon={{
									path: google.maps.SymbolPath.CIRCLE,
									scale: 8,
									fillColor: "#22C55E",
									fillOpacity: 1,
									strokeWeight: 2,
									strokeColor: "#FFFFFF",
								}}
							/>
						</GoogleMap>
					)}
				</div>

				<div className="space-y-4">
					<div className="space-y-3">
						<div className="space-y-1.5">
							<label className="text-foreground text-xs font-medium">Order ID</label>
							<div className="border-border text-muted-foreground flex h-11 items-center rounded-xl border bg-white px-4 text-sm font-semibold">
								{targetOrder ? `#${targetOrder.orderId?.slice(-6)}` : "No Active Orders"}
							</div>
						</div>
					</div>

					{targetOrder?.rider?.name && (
						<div className="space-y-4 rounded-xl bg-white p-0">
							<div className="flex items-start justify-between">
								<div>
									<div className="mb-1 flex items-center gap-2">
										<span className="text-base font-bold">{targetOrder.rider.name}</span>
									</div>
									<p className="text-muted-foreground text-[11px] font-medium">
										Current Location: En Route
									</p>
								</div>
								<div className="text-right">
									<div className="mb-1 flex items-center justify-end gap-1.5 text-xs font-medium">
										Status <div className="size-2 rounded-full bg-[#22C55E]" /> Active
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3 pt-2">
								<Button className="h-11 rounded-lg bg-[#43A149] text-sm font-medium text-white shadow-sm hover:bg-[#43A149]/90">
									Assign
								</Button>
								<Button className="h-11 rounded-lg bg-[#4B5563] text-sm font-medium text-white shadow-sm hover:bg-[#4B5563]/90">
									Contact Rider
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
