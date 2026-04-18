// src/components/Rider/RiderManagementTab/RiderProfile/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { useRiders } from "@/hooks/riderManagement"; // Assuming you use the same hook or a single rider hook
import { Loader2 } from "lucide-react";
import RiderKycTab from "./RiderKycTab";
import ProfileTab from "./ProfileTab";
import RiderPerformanceTab from "./RiderPerformanceTab";

interface RiderProfileProps {
	riderId: string;
}

const TAB_ITEMS: TabItem[] = [
	{ id: "profile", label: "Profile" },
	{ id: "kyc_verification", label: "KYC Verification" },
	{ id: "performance_metrics", label: "Performance Metrics" },
];

export default function RiderProfileIndex({ riderId }: RiderProfileProps) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("profile");

	// Fetching the rider data.
	// If you have a useRider(riderId) hook, use that.
	// Otherwise, we find the rider from the list:
	const { data: response, isLoading, isError } = useRiders();
	const rider = response?.data?.find((r: any) => r._id === riderId);

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	if (isError || !rider) {
		return (
			<div className="p-8 text-center">
				<p className="text-red-500">Rider not found or error loading data.</p>
				<Link href={ROUTES.RIDERS} className="text-secondary mt-4 block underline">
					Back to Management
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full space-y-6">
			{/* Header / Title */}
			<div className="flex items-center gap-2">
				<h2 className="text-xl font-medium text-black">Profile</h2>
			</div>

			{/* Main Card Container */}
			<div className="border-border/50 relative min-h-[600px] rounded-[32px] border bg-white p-8 shadow-sm">
				<Link href={ROUTES.RIDERS}>
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-muted absolute right-6 top-6 rounded-full"
					>
						<Icon icon="ph:arrow-u-up-left-bold" width="20" />
					</Button>
				</Link>

				{/* Rider Info Header */}
				<div className="mb-8 flex flex-col items-start gap-6 md:flex-row md:items-center">
					{/* Avatar */}
					<div className="flex size-24 items-center justify-center rounded-full bg-[#E8E6D9] text-[#8E8B7B]">
						{rider.profilePicture ? (
							<img src={rider.profilePicture} alt={rider.name} className="size-24 rounded-full object-cover shadow-sm" />
						) : (
							<div className="flex size-20 items-center justify-center rounded-full bg-[#D9D7C8]">
								<Icon icon="ph:user-fill" width="40" />
							</div>
						)}
					</div>

					<div className="space-y-1">
						<h1 className="text-foreground text-2xl font-bold">{rider.name}</h1>
						<Badge
							variant="outline"
							className="text-muted-foreground border-border rounded-md bg-[#F5F5F4] px-2 py-0.5 text-xs font-normal"
						>
							Rider's ID Number: {rider._id.slice(-8).toUpperCase()}
						</Badge>
					</div>
				</div>

				{/* Tabs & Status Row */}
				<div className="border-border/0 flex flex-col items-end justify-between gap-4 border-b pb-0 md:flex-row md:items-center">
					<div className="bg-muted/30 w-fit rounded-full p-1.5">
						<CustomTabs
							items={TAB_ITEMS}
							activeTab={activeTab}
							onTabChange={setActiveTab}
							className="[&_button[data-state=active]]:bg-secondary [&_button[data-state=active]]:text-white [&_button]:h-9 [&_button]:px-5 [&_button]:text-xs"
						/>
					</div>

					<div 
						className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
							rider.riderProfile?.availabilityStatus?.toLowerCase() === "online"
								? "bg-[#E8F5E9] text-[#22C55E]"
								: "bg-[#F4F4F5] text-[#71717A]"
						}`}
					>
						<div 
							className={`size-2 rounded-full ${
								rider.riderProfile?.availabilityStatus?.toLowerCase() === "online" 
									? "bg-[#22C55E]" 
									: "bg-[#71717A]"
							}`} 
						/>
						{rider.riderProfile?.availabilityStatus?.charAt(0).toUpperCase() + rider.riderProfile?.availabilityStatus?.slice(1) || "Offline"}
					</div>
				</div>

				<div className="bg-border/40 mb-8 mt-6 h-px w-full" />

				{/* Tab Content */}
				<div className="animate-in fade-in zoom-in-95 duration-200">
					{/* FIXED: Passing the rider prop to the components */}
					{activeTab === "profile" && <ProfileTab rider={rider} />}
					{activeTab === "kyc_verification" && <RiderKycTab rider={rider} />}
					{activeTab === "performance_metrics" && <RiderPerformanceTab rider={rider} />}
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
