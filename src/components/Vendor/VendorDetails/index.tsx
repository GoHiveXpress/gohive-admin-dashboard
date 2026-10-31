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
import { useVendor, useUpdateAccountStatus } from "@/hooks/userManagement";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmReasonModal from "@/components/_modals/ConfirmReasonModal";
import PermissionGate from "@/components/PermissionGate";
import { ACTION_RULES } from "@/lib/permissions";
import { closureLabel, isClosedNow } from "@/lib/accountTools";
import KycVerificationTab from "./KycVerification";
import MenuManagementTab from "./MenuManagement";
import ProfileManagementTab from "./ProfileManagement";
import StoreControlsTab from "./StoreControls";

interface VendorDetailsProps {
	vendorId: string;
}

const TAB_ITEMS: TabItem[] = [
	{ id: "profile_management", label: "Profile Management" },
	{ id: "menu_management", label: "Menu Management" },
	{ id: "kyc_verification", label: "KYC Verification" },
	{ id: "store_controls", label: "Store Controls" },
];

export default function VendorDetailsIndex({ vendorId }: VendorDetailsProps) {
	const [activeTab, setActiveTab] = useState("profile_management");
	const updateStatus = useUpdateAccountStatus();
	const [pendingStatus, setPendingStatus] = useState<"Active" | "Suspend" | null>(null);

	const { data: vendorResponse, isLoading, refetch } = useVendor(vendorId);
	const vendor = vendorResponse?.data;

	const handleStatusToggle = async (reason: string) => {
		if (!pendingStatus) return;
		const newStatus = pendingStatus;
		try {
			await updateStatus.mutateAsync({
				userId: vendorId,
				status: newStatus,
				reason: reason || undefined,
			});
			toast.success(
				`Account ${newStatus === "Active" ? "reactivated" : "suspended"} successfully`,
			);
			setPendingStatus(null);
			await refetch();
		} catch {
			// The hook already showed the error
		}
	};

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

	const closure = vendor.vendorProfile?.adminClosure;
	const closedByAdmin = isClosedNow(closure);

	return (
		<div className="w-full space-y-6">
			{closedByAdmin && closure && (
				<div
					role="status"
					className="bg-destructive/5 border-destructive/20 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border px-5 py-3"
				>
					<div className="flex items-center gap-3">
						<Icon icon="ph:storefront" className="text-destructive size-5" />
						<div>
							<p className="text-destructive text-sm font-semibold">
								{closureLabel(closure)}
							</p>
							<p className="text-muted-foreground text-xs">{closure.reason}</p>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setActiveTab("store_controls")}
					>
						Manage
					</Button>
				</div>
			)}
			{/* Header / Banner Card */}
			<div className="border-border/50 relative overflow-hidden rounded-[20px] border bg-white shadow-sm">
				{/* Banner Image */}
				<div className="bg-muted relative h-48 w-full">
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
									src={
										vendor.profilePicture || vendor.vendorProfile.passportPhoto
									}
									alt="Vendor"
									className="size-full bg-white object-cover"
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
									className={`size-2 rounded-full ${vendor.accountStatus === "Active" ? "bg-secondary" : "bg-destructive"}`}
								/>
								<span
									className={`${vendor.accountStatus === "Active" ? "text-secondary" : "text-destructive"} mr-2 text-sm font-medium`}
								>
									{vendor.accountStatus === "Active" ? "Active" : "Suspended"}
								</span>
								<PermissionGate rule={ACTION_RULES.updateAccountStatus}>
									{vendor.accountStatus === "Suspend" && (
										<Button
											size="sm"
											className="bg-secondary hover:bg-secondary/80 h-7 rounded-full px-3 text-[10px]"
											onClick={() => setPendingStatus("Active")}
											disabled={updateStatus.isPending}
										>
											{updateStatus.isPending
												? "Activating..."
												: "Activate Account"}
										</Button>
									)}
									{vendor.accountStatus === "Active" && (
										<Button
											variant="outline"
											size="sm"
											className="border-destructive/30 text-destructive hover:bg-destructive/5 h-7 rounded-full px-3 text-[10px]"
											onClick={() => setPendingStatus("Suspend")}
											disabled={updateStatus.isPending}
										>
											{updateStatus.isPending
												? "Suspending..."
												: "Suspend Account"}
										</Button>
									)}
								</PermissionGate>
							</div>
						</div>

						{/* Global Active Toggle */}
						<div className="mb-2 flex items-center gap-2 sm:ml-auto">
							<span
								className={`text-sm font-medium ${vendor?.vendorProfile?.availabilityStatus === "online" ? "text-secondary" : "text-muted-foreground"}`}
							>
								{vendor?.vendorProfile?.availabilityStatus === "online"
									? "Active"
									: "Inactive"}
							</span>
							<Switch
								checked={vendor?.vendorProfile?.availabilityStatus === "online"}
								disabled
								className="data-[state=checked]:bg-secondary"
							/>
						</div>
					</div>

					{/* Tab Switcher */}
					<div className="bg-muted/30 mt-8 w-full max-w-full overflow-hidden rounded-[2rem] p-1.5 sm:w-fit">
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
				{activeTab === "profile_management" && (
					<ProfileManagementTab vendor={vendor} vendorId={vendorId} />
				)}
				{activeTab === "menu_management" && <MenuManagementTab vendorId={vendorId} />}
				{activeTab === "kyc_verification" && <KycVerificationTab vendor={vendor} />}
				{activeTab === "store_controls" && <StoreControlsTab vendor={vendor} />}
			</div>

			<ConfirmReasonModal
				isOpen={pendingStatus !== null}
				onOpenChange={(open) => !open && setPendingStatus(null)}
				onConfirm={handleStatusToggle}
				isLoading={updateStatus.isPending}
				tone={pendingStatus === "Suspend" ? "danger" : "success"}
				reasonRequired={pendingStatus === "Suspend"}
				title={pendingStatus === "Suspend" ? "Suspend vendor?" : "Reactivate vendor?"}
				description={
					pendingStatus === "Suspend"
						? `${vendor.vendorProfile?.businessName || vendor.name} will be signed out and stop receiving orders until reactivated. The reason is saved in the audit log and sent to them.`
						: `${vendor.vendorProfile?.businessName || vendor.name} will be able to sign in and receive orders again.`
				}
				confirmLabel={pendingStatus === "Suspend" ? "Suspend" : "Reactivate"}
			/>
		</div>
	);
}

/* eslint-enable */
