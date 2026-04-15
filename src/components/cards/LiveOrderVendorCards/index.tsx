"use client";

import { Icon } from "@iconify/react";
import AlertVendorCard, { type OrderCardData } from "../AlertVendorCards";

// Mock Data for the grid
const MOCK_LIVE_ORDERS: OrderCardData[] = [
	{
		id: "1",
		vendorName: "Adereal Felix",
		time: "7:45 PM",
		eta: "10 mins",
		status: "Pending",
		items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
	},
	{
		id: "2",
		vendorName: "Adereal Felix",
		time: "7:45 PM",
		eta: "10 mins",
		status: "Pending",
		items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
	},
	{
		id: "3",
		vendorName: "Adereal Felix",
		time: "7:45 PM",
		eta: "10 mins",
		status: "Preparing",
		items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
	},
	{
		id: "4",
		vendorName: "Adereal Felix",
		time: "7:45 PM",
		eta: "10 mins",
		status: "Preparing",
		items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
	},
	{
		id: "5",
		vendorName: "Adereal Felix",
		time: "7:45 PM",
		eta: "10 mins",
		status: "Delayed",
		items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
	},
	{
		id: "6",
		vendorName: "Adereal Felix",
		time: "7:45 PM",
		eta: "10 mins",
		status: "Delayed",
		items: ["1 X Mixed Rice with Chicken", "1 X Fanta 50cl"],
	},
];

export default function LiveOrderVendorCards() {
	return (
		<div className="mt-6 flex flex-col gap-6 lg:flex-row">
			{/* Left Side: Live Order Stats */}
			<div className="w-full shrink-0 space-y-6 lg:w-[240px]">
				<div className="mb-4 flex items-center gap-2">
					<Icon icon="ph:broadcast-bold" className="text-secondary size-6" />
					<h2 className="text-foreground text-lg font-bold">Live Orders</h2>
				</div>

				{/* Stats List */}
				<div className="space-y-4">
					{/* Delayed */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="bg-destructive flex size-10 items-center justify-center rounded-full text-white">
							<Icon icon="ph:map-pin-fill" width="20" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Delayed</span>
							<span className="text-lg font-bold">10</span>
						</div>
					</div>

					{/* Preparing (Using Blue as seen in screenshot) */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="flex size-10 items-center justify-center rounded-full bg-blue-500 text-white">
							<Icon icon="ph:map-pin-fill" width="20" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Preparing</span>
							<span className="text-lg font-bold">10</span>
						</div>
					</div>

					{/* En route (Orange/Reddish) */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="flex size-10 items-center justify-center rounded-full bg-[#FF4500] text-white">
							<Icon icon="ph:map-pin-fill" width="20" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">En route</span>
							<span className="text-lg font-bold">10</span>
						</div>
					</div>

					{/* Pending (Yellow/Primary) */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="bg-primary flex size-10 items-center justify-center rounded-full text-white">
							<Icon icon="ph:map-pin-fill" width="20" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Pending</span>
							<span className="text-lg font-bold">5</span>
						</div>
					</div>

					{/* Picked up (Green/Secondary) */}
					<div className="flex items-center gap-4 rounded-lg bg-[#fcfcfc] p-2">
						<div className="bg-secondary flex size-10 items-center justify-center rounded-full text-white">
							<Icon icon="ph:map-pin-fill" width="20" />
						</div>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-sm font-medium">Picked up</span>
							<span className="text-lg font-bold">10</span>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side: Cards Grid */}
			<div className="flex-1">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{MOCK_LIVE_ORDERS.map((order) => (
						<AlertVendorCard key={order.id} data={order} />
					))}
				</div>
			</div>
		</div>
	);
}
