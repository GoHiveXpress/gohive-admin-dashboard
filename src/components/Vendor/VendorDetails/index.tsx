// src/components/Vendor/VendorDetails/index.tsx
/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useSingleVendor } from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";
import KycVerificationTab from "./KycVerification";
import MenuManagementTab from "./MenuManagement";
import ProfileManagementTab from "./ProfileManagement";

interface VendorDetailsProps {
	vendorId: string;
}

const TAB_ITEMS: TabItem[] = [
	{ id: "profile_management", label: "Profile Management" },
	{ id: "menu_management", label: "Menu Management" },
	{ id: "kyc_verification", label: "KYC Verification" },
];

export default function VendorDetailsIndex({ vendorId }: VendorDetailsProps) {
	const [activeTab, setActiveTab] = useState("profile_management");
	const [isActive, setIsActive] = useState(true);

	const { data: vendorResponse, isLoading } = useSingleVendor(vendorId);
	const vendor = vendorResponse?.data;

	if (isLoading) {
		return (
			<div className="flex min-h-[600px] items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	if (!vendor) {
		return <div className="p-6">Vendor not found</div>;
	}

	return (
		<div className="w-full space-y-6">
			{/* Header / Banner Card */}
			<div className="border-border/50 relative rounded-[20px] border bg-white p-6 shadow-sm">
				<Link href={ROUTES.VENDORS}>
					<Button variant="ghost" className="absolute right-4 top-4">
						<Icon icon="ph:arrow-u-up-left-bold" width="20" />
					</Button>
				</Link>

				<div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
					{/* Avatar */}
					<div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-[#E8E6D9] text-[#8E8B7B]">
						{vendor.profilePicture || vendor.vendorProfile.passportPhoto ? (
							<img
								src={vendor.profilePicture || vendor.vendorProfile.passportPhoto}
								alt="Vendor"
								className="size-full object-cover"
							/>
						) : (
							<div className="size-20 rounded-full bg-[#D9D7C8]" />
						)}
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-foreground text-2xl font-bold">
								{vendor.vendorProfile?.businessName || vendor.name}
							</h1>
							<Badge
								variant="outline"
								className="text-muted-foreground border-border text-xs font-normal"
							>
								Vendor I.D : {vendor._id.slice(-6).toUpperCase()}
							</Badge>
						</div>
						<div className="flex items-center gap-2">
							<div
								className={`size-2 rounded-full ${vendor.vendorProfile?.isApproved ? "bg-secondary" : "bg-muted"}`}
							/>
							<span className="text-secondary text-sm font-medium">
								{vendor.vendorProfile?.isApproved ? "Active" : "Pending"}
							</span>
						</div>
					</div>

					{/* Global Active Toggle */}
					<div className="flex items-center gap-2 md:ml-auto">
						<span
							className={`text-sm font-medium ${isActive ? "text-secondary" : "text-muted-foreground"}`}
						>
							{isActive ? "Active" : "Inactive"}
						</span>
						<Switch
							checked={isActive}
							onCheckedChange={setIsActive}
							className="data-[state=checked]:bg-secondary"
						/>
					</div>
				</div>

				{/* Tab Switcher */}
				<div className="bg-muted/30 mt-8 w-fit rounded-full p-1.5">
					<CustomTabs
						items={TAB_ITEMS}
						activeTab={activeTab}
						onTabChange={setActiveTab}
						className="[&_button[data-state=active]]:bg-secondary [&_button[data-state=active]]:text-white"
					/>
				</div>
			</div>

			{/* Tab Content Area */}
			<div className="animate-in fade-in slide-in-from-bottom-2 min-h-[500px] duration-300">
				{activeTab === "profile_management" && <ProfileManagementTab vendor={vendor} />}
				{activeTab === "menu_management" && <MenuManagementTab />}
				{activeTab === "kyc_verification" && <KycVerificationTab vendor={vendor} />}
			</div>
		</div>
	);
}

/* eslint-enable */
