// src/components/Vendor/VendorDetails/KycVerification/index.tsx
/* eslint-disable no-use-before-define */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type VendorUser } from "@/types/vendorManagement";
import { useUpdateVendorStatus } from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";

interface KycVerificationTabProps {
	vendor: VendorUser;
}

export default function KycVerificationTab({ vendor }: KycVerificationTabProps) {
	const [status, setStatus] = useState<string>(
		vendor.vendorProfile.verificationStatus ||
			(vendor.vendorProfile.isApproved ? "approved" : "pending"),
	);

	const [comment, setComment] = useState("");

	// UPDATED: Use the new hook
	const { mutate: updateVendorStatus, isPending } = useUpdateVendorStatus();

	const handleSave = () => {
		// UPDATED: Now handles all status types, not just approved
		updateVendorStatus({
			id: vendor._id,
			status: status as "pending" | "approved" | "rejected",
		});

		// You can handle the comment submission here later if you add backend support for it
	};

	const hasNIN = !!vendor.vendorProfile.govtIdImage;
	const hasPassport = !!vendor.vendorProfile.passportPhoto;
	const hasLicense = !!vendor.vendorProfile.cacNumber;

	return (
		<div className="border-border/50 min-h-[600px] rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Left Column: Document Upload */}
				<div className="border-border/60 h-fit rounded-[20px] border p-6">
					<h3 className="text-foreground mb-6 text-base font-medium">Document Upload</h3>

					<div className="space-y-1">
						<DocumentRow
							number="1"
							label="Government ID / NIN"
							status={hasNIN ? "view" : "missing"}
							viewLink={vendor.vendorProfile.govtIdImage}
						/>
						<DocumentRow
							number="2"
							label="Passport"
							status={hasPassport ? "view" : "missing"}
							viewLink={vendor.vendorProfile.passportPhoto}
						/>
						<DocumentRow
							number="3"
							label="Business License (CAC)"
							status={hasLicense ? "view" : "missing"}
							viewLink="#"
						/>
						<DocumentRow number="4" label="Tax Information" status="missing" isLast />
					</div>
				</div>

				{/* Right Column: Access Panel */}
				<div className="border-border/60 h-fit rounded-[20px] border p-6">
					<h3 className="text-foreground mb-6 text-base font-medium">Access Panel</h3>

					<div className="space-y-6">
						{/* Status Dropdown */}
						<div className="space-y-3">
							<Label className="text-foreground text-sm font-medium">
								Set Status
							</Label>
							<Select value={status} onValueChange={setStatus}>
								<SelectTrigger className="border-border h-12 rounded-xl bg-white">
									<SelectValue placeholder="Select Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="approved">Approved</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="rejected">Rejected</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Comment Box */}
						<div className="space-y-3">
							<Label className="text-foreground text-sm font-medium">Comment</Label>
							<Textarea
								placeholder="Input comment"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className="border-border min-h-[140px] resize-none rounded-xl bg-white p-4"
							/>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-4 pt-4">
							<Button
								variant="outline"
								className="border-border text-foreground h-12 flex-1 rounded-full bg-[#F9FAFB] font-medium hover:bg-[#F3F4F6]"
							>
								Cancel
							</Button>
							<Button
								onClick={handleSave}
								// UPDATED: Removed `|| status !== "approved"` so you can click save when rejected/pending
								disabled={isPending}
								className="h-12 flex-1 rounded-full bg-[#419A44] font-medium text-white hover:bg-[#419A44]/90"
							>
								{isPending ? (
									<Loader2 className="mr-2 size-4 animate-spin" />
								) : null}
								Save
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Helper Component for Document Row
interface DocumentRowProps {
	number: string;
	label: string;
	status: "view" | "missing";
	isLast?: boolean;
	viewLink?: string;
}

function DocumentRow({ number, label, status, isLast, viewLink }: DocumentRowProps) {
	return (
		<div
			className={`flex items-center justify-between py-5 ${!isLast ? "border-border/40 border-b" : ""}`}
		>
			<div className="flex items-center gap-4">
				{/* Number Circle */}
				<div className="border-foreground/80 text-foreground flex size-8 items-center justify-center rounded-full border text-sm font-medium">
					{number}
				</div>
				<span className="text-foreground text-sm font-medium">{label}</span>
			</div>

			{status === "view" ? (
				<a href={viewLink !== "#" ? viewLink : undefined} target="_blank" rel="noreferrer">
					<Button
						variant="outline"
						className="border-border text-foreground hover:bg-muted h-9 gap-2 rounded-full px-4 text-sm font-normal"
						disabled={!viewLink || viewLink === "#"}
					>
						<Icon icon="ph:eye" className="size-4" />
						View
					</Button>
				</a>
			) : (
				<div className="border-border/50 text-muted-foreground flex h-9 items-center justify-center rounded-full border bg-[#F5F5F4] px-4 text-[10px] font-medium italic sm:text-xs">
					Not Uploaded Yet
				</div>
			)}
		</div>
	);
}

/* eslint-enable */
