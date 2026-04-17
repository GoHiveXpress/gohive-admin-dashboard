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
			<div className="border-border/50 relative overflow-hidden rounded-[20px] border bg-white shadow-sm">
				{/* Banner Image */}
				<div className="relative h-48 w-full bg-muted">
					{vendor.vendorProfile?.businessBanner ? (
						<img
							src={vendor.vendorProfile.businessBanner}
							alt="Vendor Banner"
							className="size-full object-cover object-center"
						/>
					) : (
						<div className="size-full bg-gradient-to-tr from-gray-200 to-gray-100" />
					)}
					<Link href={ROUTES.VENDORS}>
						<Button
							variant="outline"
							className="absolute right-4 top-4 border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/40 hover:text-white"
						>
							<Icon icon="ph:arrow-u-up-left-bold" width="20" />
						</Button>
					</Link>
				</div>

				<div className="px-6 pb-6">
					<div className="relative -mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
						{/* Avatar */}
						<div className="flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#E8E6D9] text-[#8E8B7B] shadow-sm">
							{vendor.profilePicture || vendor.vendorProfile.passportPhoto ? (
								<img
									src={vendor.profilePicture || vendor.vendorProfile.passportPhoto}
									alt="Vendor"
									className="size-full object-cover bg-white"
								/>
							) : (
								<div className="size-full bg-[#D9D7C8]" />
							)}
						</div>

						<div className="mb-2 space-y-2">
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
						<div className="mb-2 flex items-center gap-2 sm:ml-auto">
							<span
								className={`text-sm font-medium ${vendor?.vendorProfile?.availabilityStatus === "online" ? "text-secondary" : "text-muted-foreground"}`}
							>
								{vendor?.vendorProfile?.availabilityStatus === "online" ? "Active" : "Inactive"}
							</span>
							<Switch
								checked={vendor?.vendorProfile?.availabilityStatus === "online"}
								disabled
								className="data-[state=checked]:bg-secondary"
							/>
						</div>
					</div>

					{/* Tab Switcher */}
					<div className="bg-muted/30 mt-8 w-full sm:w-fit max-w-full overflow-hidden rounded-[2rem] p-1.5">
						<CustomTabs
							items={TAB_ITEMS}
							activeTab={activeTab}
							onTabChange={setActiveTab}
							className="[&_button[data-state=active]]:bg-secondary [&_button[data-state=active]]:text-white"
						/>
					</div>
				</div>
			</div>

			<div className="animate-in fade-in slide-in-from-bottom-2 min-h-[500px] duration-300">
				{activeTab === "profile_management" && <ProfileManagementTab vendor={vendor} />}
				{activeTab === "menu_management" && <MenuManagementTab vendorId={vendorId} />}
				{activeTab === "kyc_verification" && <KycVerificationTab vendor={vendor} />}
			</div>
		</div>
	);
}

/* eslint-enable */
