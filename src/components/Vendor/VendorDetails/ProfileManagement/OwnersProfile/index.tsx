// src/components/Vendor/VendorDetails/ProfileManagement/OwnersProfile/index.tsx

"use client";

import FloatingInput from "@/components/FormElements/FloatingInput";
import { type VendorUser } from "@/types/vendorManagement";

interface OwnersProfileProps {
	vendor: VendorUser;
}

export default function OwnersProfile({ vendor }: OwnersProfileProps) {
	return (
		<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
			<FloatingInput label="Full Name" defaultValue={vendor.name} icon="ph:user-fill" />

			<FloatingInput
				label="Phone Number"
				defaultValue={vendor.phone || ""}
				icon="ph:phone-fill"
			/>

			<FloatingInput
				label="Email"
				defaultValue={vendor.email}
				icon="ph:envelope-simple-fill"
			/>

			{/* View Only for Images in Admin Panel usually */}
			<div className="space-y-1">
				<FloatingInput
					label="Passport Photo"
					readOnly
					value={vendor.vendorProfile.passportPhoto ? "Uploaded" : "Not Uploaded"}
					icon="ph:upload-simple-bold"
					className="cursor-pointer"
				/>
				{vendor.vendorProfile.passportPhoto && (
					<a
						href={vendor.vendorProfile.passportPhoto}
						target="_blank"
						rel="noreferrer"
						className="text-secondary pl-2 text-xs hover:underline"
					>
						View Image
					</a>
				)}
			</div>

			<div className="space-y-1">
				<FloatingInput
					label="Government-issued ID upload"
					readOnly
					value={vendor.vendorProfile.govtIdImage ? "Uploaded" : "Not Uploaded"}
					icon="ph:upload-simple-bold"
					className="cursor-pointer"
				/>
				{vendor.vendorProfile.govtIdImage && (
					<a
						href={vendor.vendorProfile.govtIdImage}
						target="_blank"
						rel="noreferrer"
						className="text-secondary pl-2 text-xs hover:underline"
					>
						View Image
					</a>
				)}
			</div>
		</div>
	);
}
