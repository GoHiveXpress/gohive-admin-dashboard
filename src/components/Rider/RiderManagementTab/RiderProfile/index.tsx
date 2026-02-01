//src/components/Rider/RiderManagementTab/RiderProfile/index.tsx
"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomTabs, { TabItem } from "@/components/Tabs";
import { useRouter } from "next/navigation";
import RiderPerformanceTab from "./RiderPerformanceTab";
import ProfileTab from "./ProfileTab";
import RiderKycTab from "./RiderKycTab";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { useRiders } from "@/hooks/riderManagement"; // Assuming you use the same hook or a single rider hook
import { Loader2 } from "lucide-react";

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
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        );
    }

    if (isError || !rider) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500">Rider not found or error loading data.</p>
                <Link href={ROUTES.RIDERS} className="text-secondary underline mt-4 block">Back to Management</Link>
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
			<div className="bg-white p-8 rounded-[32px] shadow-sm border border-border/50 min-h-[600px] relative">
				<Link href={ROUTES.RIDERS}>
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-6 right-6 hover:bg-muted rounded-full"
					>
						<Icon icon="ph:arrow-u-up-left-bold" width="20" />
					</Button>
				</Link>

				{/* Rider Info Header */}
				<div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
					{/* Avatar */}
					<div className="w-24 h-24 rounded-full bg-[#E8E6D9] flex items-center justify-center text-[#8E8B7B]">
						<div className="w-20 h-20 rounded-full bg-[#D9D7C8] flex items-center justify-center">
                            <Icon icon="ph:user-fill" width="40" />
                        </div>
					</div>

					<div className="space-y-1">
						<h1 className="text-2xl font-bold text-foreground">{rider.name}</h1>
						<Badge
							variant="outline"
							className="text-xs font-normal text-muted-foreground border-border bg-[#F5F5F4] rounded-md px-2 py-0.5"
						>
							Rider's ID Number: {rider._id.slice(-8).toUpperCase()}
						</Badge>
					</div>
				</div>

				{/* Tabs & Status Row */}
				<div className="flex flex-col md:flex-row justify-between items-end md:items-center border-b border-border/0 pb-0 gap-4">
					<div className="bg-muted/30 p-1.5 rounded-full w-fit">
						<CustomTabs
							items={TAB_ITEMS}
							activeTab={activeTab}
							onTabChange={setActiveTab}
							className="[&_button]:h-9 [&_button]:text-xs [&_button]:px-5 [&_button[data-state=active]]:bg-secondary [&_button[data-state=active]]:text-white"
						/>
					</div>

					<div className="bg-[#E8F5E9] text-[#22C55E] px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
						<div className="w-2 h-2 rounded-full bg-[#22C55E]" />
						{rider.riderProfile?.availabilityStatus || "Active"}
					</div>
				</div>

				<div className="h-px w-full bg-border/40 mt-6 mb-8" />

				{/* Tab Content */}
				<div className="animate-in fade-in zoom-in-95 duration-200">
                    {/* FIXED: Passing the rider prop to the components */}
					{activeTab === "profile" && <ProfileTab rider={rider} />}
					{activeTab === "kyc_verification" && <RiderKycTab rider={rider} />}
					{activeTab === "performance_metrics" && <RiderPerformanceTab />}
				</div>
			</div>
		</div>
	);
}