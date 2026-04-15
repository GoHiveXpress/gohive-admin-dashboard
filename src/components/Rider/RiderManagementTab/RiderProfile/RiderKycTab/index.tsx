// src/components/Rider/RiderManagementTab/RiderProfile/RiderKycTab/index.tsx
/* eslint-disable no-use-before-define */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type RiderUser } from "@/types/riderManagement";
import { useUpdateRiderStatus } from "@/hooks/riderManagement";
import { Loader2 } from "lucide-react";

interface RiderKycTabProps {
	rider: RiderUser;
}

export default function RiderKycTab({ rider }: RiderKycTabProps) {
	// Initialize status from API data
	const [status, setStatus] = useState<string>(
		rider.riderProfile.verificationStatus ||
			(rider.riderProfile.isApproved ? "approved" : "pending"),
	);
	const [comment, setComment] = useState("");

	const { mutate: updateStatus, isPending } = useUpdateRiderStatus();

	const handleSave = () => {
		updateStatus({
			id: rider._id,
			status: status as "pending" | "approved" | "rejected",
		});
		// Note: Comment logic would go here if API supported it
	};

	// Document Helpers
	const profile = rider.riderProfile;
	const hasLicense = !!profile.driversLicenseImage;
	const hasPassport = !!profile.passportPhoto;
	const hasBikeImage = !!profile.vehicleImage;
	// Plate number is text, not file, so we check if string exists
	const hasPlateNumber = !!profile.vehiclePlateNumber;

	return (
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
			{/* Left Column: Document Upload */}
			<div className="border-border/60 h-fit rounded-[20px] border p-6">
				<h3 className="text-foreground mb-6 text-sm font-medium">Document Upload</h3>

				<div className="space-y-1">
					{/* Assuming NIN isn't in model, marking as missing or mapping to a different field */}
					<DocumentRow number="1" label="NIN" status="missing" />

					<DocumentRow
						number="2"
						label="Passport"
						status={hasPassport ? "view" : "missing"}
						viewLink={profile.passportPhoto}
					/>

					{/* Plate number is usually just text, but if it was an image: */}
					<DocumentRow
						number="3"
						label={`Plate: ${profile.vehiclePlateNumber || "N/A"}`}
						status={hasPlateNumber ? "view" : "missing"}
						// View link disabled for text-only data
						viewLink="#"
					/>

					<DocumentRow
						number="4"
						label="Bike Image"
						status={hasBikeImage ? "view" : "missing"}
						viewLink={profile.vehicleImage}
					/>

					<DocumentRow
						number="5"
						label="Driver's License"
						status={hasLicense ? "view" : "missing"}
						viewLink={profile.driversLicenseImage}
						isLast
					/>
				</div>
			</div>

			{/* Right Column: Access Panel */}
			<div className="border-border/60 h-fit rounded-[20px] border p-6">
				<h3 className="text-foreground mb-6 text-sm font-medium">Access Panel</h3>

				<div className="space-y-6">
					{/* Status Dropdown - Using Standard Select to ensure controlled state works perfectly */}
					<div className="space-y-2">
						<Label className="text-foreground ml-1 text-xs font-medium">
							Set Status
						</Label>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="border-border h-12 w-full rounded-xl bg-white">
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
					<div className="space-y-2">
						<Label className="text-foreground ml-1 text-xs font-medium">Comment</Label>
						<Textarea
							placeholder="Input comment"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="border-border focus-visible:ring-secondary min-h-[120px] resize-none rounded-2xl bg-white p-4"
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-4 pt-2">
						<Button
							variant="outline"
							className="border-border text-foreground h-12 flex-1 rounded-full bg-[#F9FAFB] font-medium hover:bg-[#F3F4F6]"
						>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isPending}
							className="bg-secondary hover:bg-secondary/90 h-12 flex-1 rounded-full font-medium text-white"
						>
							{isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
							Save
						</Button>
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
				<div className="border-foreground/80 text-foreground flex size-8 items-center justify-center rounded-full border text-xs font-medium">
					{number}
				</div>
				<span className="text-foreground text-xs font-medium sm:text-sm">{label}</span>
			</div>

			{status === "view" && viewLink && viewLink !== "#" ? (
				<a href={viewLink} target="_blank" rel="noopener noreferrer">
					<Button
						variant="outline"
						className="border-border text-foreground hover:bg-muted h-9 gap-2 rounded-full px-4 text-xs font-normal"
					>
						<Icon icon="ph:eye" className="size-4" />
						View
					</Button>
				</a>
			) : (
				<div className="border-border/50 text-muted-foreground flex h-9 items-center justify-center rounded-full border bg-[#F5F5F4] px-4 text-[10px] font-medium italic">
					{status === "missing" ? "Not Uploaded Yet" : "No File"}
				</div>
			)}
		</div>
	);
}

/* eslint-enable */
