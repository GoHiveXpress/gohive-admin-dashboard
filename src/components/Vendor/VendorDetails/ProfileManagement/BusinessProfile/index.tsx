// src/components/Vendor/VendorDetails/ProfileManagement/BusinessProfile/index.tsx
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, no-use-before-define */

"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import FloatingInput from "@/components/FormElements/FloatingInput";
import { type VendorUser, type OperatingHours } from "@/types/vendorManagement";
import { useVendorCategories } from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";

interface BusinessProfileProps {
	vendor: VendorUser;
}

export default function BusinessProfile({ vendor }: BusinessProfileProps) {
	const profile = vendor.vendorProfile;
	const hours = profile.operatingHours || [];
	const { data: categoriesResponse, isLoading } = useVendorCategories();
	const vendorCategories = categoriesResponse?.data || [];

	const displayBusinessType = isLoading
		? "Loading..."
		: vendorCategories.find((cat) => cat.value === profile?.businessType)?.title ||
			profile?.businessType ||
			"N/A";


	// Helper to find specific day hours or default
	const getDayHours = (day: string) => {
		return (
			hours.find((h) => h.day === day) || {
				day,
				isOpen: false,
				openTime: "09:00 AM",
				closeTime: "09:00 PM",
				is24Hours: false,
			}
		);
	};

	const daysOfWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];

	return (
		<div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
			{/* Left Column: Form Fields */}
			<div className="space-y-6">
				<FloatingInput
					label="Business Name"
					defaultValue={profile.businessName}
					icon="ph:storefront"
					readOnly
				/>

				<FloatingInput
					label="Business Type"
					value={displayBusinessType}
					icon="ph:storefront"
					readOnly
				/>

				<FloatingInput
					label="Business Registration Number"
					defaultValue={profile.cacNumber}
					icon="ph:hash"
					readOnly
				/>

				<FloatingInput
					label="Business Address"
					defaultValue={profile.businessAddress}
					icon="ph:map-pin-fill"
					readOnly
				/>
			</div>

			{/* Right Column: Operating Hours */}
			<div className="space-y-4">
				<div className="mb-6 flex items-center gap-2">
					<Icon icon="ph:clock" className="text-secondary size-5" />
					<h3 className="text-foreground font-medium">Operating hours</h3>
				</div>

				<div className="space-y-3">
					{daysOfWeek.map((day) => (
						<OperatingHourRow key={day} data={getDayHours(day)} />
					))}
				</div>
			</div>
		</div>
	);
}

function OperatingHourRow({ data }: { data: OperatingHours }) {
	const [isOpen, setIsOpen] = useState(data.isOpen);

	// Parse time for display (Assuming format "HH:mm AM")
	const parseTime = (timeStr: string) => {
		const [time, period] = timeStr.split(" ");
		return { time, period };
	};

	const start = parseTime(data.openTime);
	const end = parseTime(data.closeTime);

	return (
		<div className="flex items-center justify-between bg-white py-1">
			<div className="flex w-40 items-center gap-4">
				<Switch
					checked={isOpen}
					onCheckedChange={setIsOpen}
					className="data-[state=checked]:bg-secondary scale-90"
				/>
				<span className="text-foreground text-sm font-medium">{data.day}</span>
			</div>

			<div className="flex flex-1 items-center justify-end gap-2">
				<div className="min-w-[60px] rounded bg-[#123614] px-3 py-1.5 text-center text-xs font-medium text-white">
					{start.time}
				</div>
				<span className="text-muted-foreground text-xs font-semibold uppercase">
					{start.period}
				</span>
				<span className="text-foreground mx-1 font-bold">-</span>
				<div className="min-w-[60px] rounded bg-[#123614] px-3 py-1.5 text-center text-xs font-medium text-white">
					{end.time}
				</div>
				<span className="text-muted-foreground text-xs font-semibold uppercase">
					{end.period}
				</span>
			</div>
		</div>
	);
}

/* eslint-enable */
