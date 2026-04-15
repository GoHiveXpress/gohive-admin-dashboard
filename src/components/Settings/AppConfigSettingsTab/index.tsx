"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function AppConfigSettingsTab() {
	return (
		<div className="border-border rounded-[24px] border bg-white p-8 shadow-sm">
			<div className="mb-8 flex items-center justify-between">
				<h3 className="text-foreground/80 text-xl font-medium">Fees</h3>
				{/* Using a relative container for the avatar to match screenshot position roughly */}
				<div className="relative">
					<div className="size-12 overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-sm">
						<img
							src="https://i.pravatar.cc/150?u=1"
							alt="Profile"
							className="size-full object-cover"
						/>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Delivery fee</label>
					<Input defaultValue="₦800" className="border-border h-12 rounded-xl bg-white" />
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Taxes</label>
					<div className="relative">
						<Input
							defaultValue="0"
							className="border-border h-12 rounded-xl bg-white pr-8"
						/>
						<span className="text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 text-sm">
							%
						</span>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Service fee</label>
					<Input defaultValue="₦200" className="border-border h-12 rounded-xl bg-white" />
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Delivery Radius</label>
					<Input
						defaultValue="set in km/miles per zone"
						className="border-border h-12 rounded-xl bg-white"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Commission %</label>
					<div className="relative">
						<Input
							defaultValue="5"
							className="border-border h-12 rounded-xl bg-white pr-8"
						/>
						<span className="text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 text-sm">
							%
						</span>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">
						Region (specific overrides)
					</label>
					<Select>
						<SelectTrigger className="border-border h-12 rounded-xl bg-white">
							<SelectValue placeholder="region" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="lagos">Lagos</SelectItem>
							<SelectItem value="abuja">Abuja</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="mt-10 flex justify-center">
				<Button className="bg-secondary hover:bg-secondary/90 h-12 w-full max-w-md rounded-lg text-base font-medium text-white">
					Apply Changes
				</Button>
			</div>
		</div>
	);
}

/* eslint-enable */
