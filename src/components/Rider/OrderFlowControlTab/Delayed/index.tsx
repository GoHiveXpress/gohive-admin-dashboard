"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, react/no-array-index-key */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";

export default function DelayedOrders() {
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
								<div className="size-2.5 rounded-full bg-[#EF4444]" /> Delayed (2)
							</div>
							<div className="flex items-center gap-2">
								<div className="size-2.5 rounded-full bg-[#EAB308]" /> Pending (10)
							</div>
							<div className="flex items-center gap-2">
								<div className="size-2.5 rounded-full bg-[#84CC16]" /> En route (12)
							</div>
							<div className="flex items-center gap-2">
								<div className="size-2.5 rounded-full bg-[#22C55E]" /> Completed
								(50)
							</div>
						</div>

						{/* CSS Donut Chart */}
						<div
							className="relative size-20 rounded-full"
							style={{
								background:
									"conic-gradient(#22C55E 0% 55%, #84CC16 55% 70%, #EAB308 70% 85%, #EF4444 85% 100%)",
							}}
						>
							<div className="absolute inset-2.5 rounded-full bg-white" />
						</div>
					</div>

					{/* Order Cards List */}
					<div className="custom-scrollbar max-h-[400px] flex-1 space-y-3 overflow-y-auto pr-1">
						{/* Card 1: Delayed (Red) */}
						<div className="space-y-3 rounded-2xl border border-[#FECDD3] bg-[#FFF1F2] p-4">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2 text-xs font-semibold text-[#BE123C]">
									<div className="size-2 rounded-full bg-[#BE123C]" />
									Order ID: #12345
								</div>
								<Icon
									icon="ph:copy"
									className="text-muted-foreground/70 hover:text-foreground size-4 cursor-pointer"
								/>
							</div>
							<div className="text-foreground/80 space-y-1 text-xs font-medium">
								<p>1 X Mixed Rice with Chicken</p>
								<p>1 X Fanta 50cl</p>
							</div>
						</div>

						{/* Card 2: Pending (Yellow) */}
						<div className="space-y-3 rounded-2xl border border-[#FEF08A] bg-[#FEFCE8] p-4">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2 text-xs font-semibold text-[#A16207]">
									<div className="size-2 rounded-full bg-[#EAB308]" />
									Order ID: #12345
								</div>
								<Icon
									icon="ph:copy"
									className="text-muted-foreground/70 hover:text-foreground size-4 cursor-pointer"
								/>
							</div>
							<div className="text-foreground/80 space-y-1 text-xs font-medium">
								<p>1 X Mixed Rice with Chicken</p>
								<p>1 X Fanta 50cl</p>
							</div>
						</div>

						{/* Card 3: En Route/Orange (Orange) */}
						<div className="space-y-3 rounded-2xl border border-[#FFEDD5] bg-[#FFF7ED] p-4">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C]">
									<div className="size-2 rounded-full bg-[#F97316]" />
									Order ID: #12345
								</div>
								<Icon
									icon="ph:copy"
									className="text-muted-foreground/70 hover:text-foreground size-4 cursor-pointer"
								/>
							</div>
							<div className="text-foreground/80 space-y-1 text-xs font-medium">
								<p>1 X Mixed Rice with Chicken</p>
								<p>1 X Fanta 50cl</p>
							</div>
						</div>

						{/* Card 4: Cutoff simulation */}
						<div className="rounded-2xl border border-[#FECDD3] bg-[#FFF1F2] p-4 opacity-50">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2 text-xs font-semibold text-[#BE123C]">
									<div className="size-2 rounded-full bg-[#BE123C]" />
									Order ID: #12345
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 2. SYSTEM ALERTS CARD */}
				<div className="border-border/50 h-auto shrink-0 rounded-[20px] border bg-white p-5">
					<h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-bold">
						<Icon icon="ph:siren-fill" className="size-6 text-[#EF4444]" />
						System Alerts
					</h3>

					<div className="divide-border/40 space-y-0 divide-y">
						<div className="flex items-center justify-between py-3 text-xs">
							<div className="flex items-center gap-2 font-medium">
								<Icon icon="ph:warning-fill" className="size-4 text-[#EF4444]" />
								Repeated Cancelation
							</div>
							<span className="text-muted-foreground">Rider - James James</span>
							<button className="text-muted-foreground hover:text-foreground">
								<Icon icon="ph:dots-three-vertical-bold" />
							</button>
						</div>
						<div className="flex items-center justify-between py-3 text-xs">
							<div className="flex items-center gap-2 font-medium">
								<Icon icon="ph:warning-fill" className="size-4 text-[#EAB308]" />
								Oder delay - Order ID #1234
							</div>
							<span className="text-muted-foreground">Rider - James James</span>
							<button className="text-muted-foreground hover:text-foreground">
								<Icon icon="ph:dots-three-vertical-bold" />
							</button>
						</div>
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

				{/* Status Stats Blocks */}
				<div className="space-y-3">
					<div className="border-border/60 flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
						<div className="flex items-center gap-3">
							<div className="size-3 rounded-full bg-[#F97316]" />
							<span className="text-sm font-medium">Online</span>
						</div>
						<span className="text-lg font-bold">15</span>
					</div>

					<div className="border-border/60 flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
						<div className="flex items-center gap-3">
							<div className="size-3 rounded-full bg-[#22C55E]" />
							<span className="text-sm font-medium">Available</span>
						</div>
						<span className="text-lg font-bold">10</span>
					</div>

					<div className="border-border/60 flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
						<div className="flex items-center gap-3">
							<div className="size-3 rounded-full bg-[#EF4444]" />
							<span className="text-sm font-medium">Busy</span>
						</div>
						<span className="text-lg font-bold">5</span>
					</div>
				</div>

				<div className="bg-border/50 h-px w-full" />

				{/* Active Riders List */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<h4 className="mb-4 text-base font-medium">Active Riders List</h4>
					<div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
						{[
							{
								name: "James James",
								id: "RGHV0923",
								status: "Available",
								color: "text-[#22C55E]",
								dot: "bg-[#22C55E]",
							},
							{
								name: "Daniel Ade",
								id: "RGHV0824",
								status: "Available",
								color: "text-[#22C55E]",
								dot: "bg-[#22C55E]",
							},
							{
								name: "John Gabriel",
								id: "RGHV0947",
								status: "Available",
								color: "text-[#22C55E]",
								dot: "bg-[#22C55E]",
							},
							{
								name: "John Gabriel",
								id: "RGHV0947",
								status: "Available",
								color: "text-[#22C55E]",
								dot: "bg-[#22C55E]",
							},
							{
								name: "John Gabriel",
								id: "RGHV0947",
								status: "Available",
								color: "text-[#22C55E]",
								dot: "bg-[#22C55E]",
							},
						].map((rider, i) => (
							<div
								key={i}
								className="border-border/50 hover:bg-muted/30 flex items-center justify-between rounded-xl border p-3 transition-colors"
							>
								<div className="space-y-1">
									<p className="text-sm font-semibold">{rider.name}</p>
									<div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-medium">
										Status
										<div className={`size-1.5 rounded-full ${rider.dot}`} />
										<span className="text-foreground">{rider.status}</span>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="text-muted-foreground border-border h-6 rounded-md bg-white px-2 text-[10px] font-normal"
									>
										{rider.id}
									</Badge>
									<Icon
										icon="ph:copy"
										className="size-4 cursor-pointer text-[#22C55E]"
									/>
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

				{/* Map Container */}
				<div className="border-border/50 relative min-h-[300px] flex-1 overflow-hidden rounded-2xl border bg-[#EBF0F0]">
					<div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,14,0/800x600')] bg-cover bg-center opacity-80 mix-blend-multiply" />

					{/* Mock Overlay UI on Map */}
					<div className="absolute right-10 top-10">
						<div className="size-4 animate-pulse rounded-full border-2 border-white bg-[#22C55E] shadow-lg" />
					</div>
					<div className="absolute left-1/4 top-1/3">
						<div className="size-4 rounded-full border-2 border-white bg-[#22C55E] shadow-lg" />
					</div>
					<div className="absolute bottom-1/3 left-1/2 flex flex-col items-center">
						<div className="mb-1 whitespace-nowrap rounded-full bg-[#EF4444] px-2 py-0.5 text-[10px] text-white shadow-md">
							Avalon Hotel
						</div>
						<div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#EF4444] shadow-lg">
							<Icon icon="ph:house-fill" className="size-3 text-white" />
						</div>
					</div>
					<div className="absolute right-1/4 top-1/2 flex flex-col items-center">
						<div className="mb-1 whitespace-nowrap rounded-full bg-[#F97316] px-2 py-0.5 text-[10px] text-white shadow-md">
							Shawarma place
						</div>
						<div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#F97316] shadow-lg">
							<Icon icon="ph:fork-knife-fill" className="size-3 text-white" />
						</div>
					</div>
				</div>

				{/* Selection Details */}
				<div className="space-y-4">
					<div className="space-y-3">
						<div className="space-y-1.5">
							<label className="text-foreground text-xs font-medium">Order ID</label>
							<div className="border-border text-muted-foreground flex h-11 items-center rounded-xl border bg-white px-4 text-sm">
								#12345
							</div>
						</div>
						<div className="space-y-1.5">
							<label className="text-foreground text-xs font-medium">
								Rider’s ID
							</label>
							<div className="border-border text-muted-foreground flex h-11 items-center rounded-xl border bg-white px-4 text-sm">
								RGHV0923
							</div>
						</div>
					</div>

					{/* Selected Rider Card */}
					<div className="space-y-4 rounded-xl bg-white p-0">
						<div className="flex items-start justify-between">
							<div>
								<div className="mb-1 flex items-center gap-2">
									<span className="text-base font-bold">James James</span>
									<Badge
										variant="outline"
										className="text-muted-foreground h-5 bg-white text-[10px] font-normal"
									>
										RGHV0923
									</Badge>
								</div>
								<p className="text-muted-foreground text-[11px] font-medium">
									Current Location: 1.5km from Vendor
								</p>
							</div>
							<div className="text-right">
								<div className="mb-1 flex items-center justify-end gap-1.5 text-xs font-medium">
									Status <div className="size-2 rounded-full bg-[#22C55E]" />{" "}
									Available
								</div>
								<p className="text-muted-foreground text-[11px] font-medium">
									ETA Customer (12 min)
								</p>
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
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
