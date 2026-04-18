// src/components/Rider/RiderManagementTab/RiderProfile/ProfileTab/index.tsx

"use client";

import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/FormElements/FloatingInput";
import { type RiderUser } from "@/types/riderManagement";

interface ProfileTabProps {
	rider: RiderUser;
}

export default function ProfileTab({ rider }: ProfileTabProps) {
	// Safety check
	if (!rider) return null;

	return (
		<div className="space-y-6">
			{/* View-only mode for Rider Profile */}

			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				{/* Full Name */}
				<FloatingInput
					label="Full Name"
					defaultValue={rider.name || ""}
					icon="ph:user-fill"
				/>

				{/* Phone Number */}
				<FloatingInput
					label="Phone Number"
					defaultValue={rider.phone || ""}
					icon="ph:phone-fill"
				/>

				{/* Email */}
				<FloatingInput
					label="Email"
					defaultValue={rider.email || ""}
					icon="ph:envelope-simple-fill"
					readOnly
				/>

				{/* Address */}
				{/* <FloatingInput
                    label="Address"
                    defaultValue={rider.riderProfile?.address || "N/A"} 
                    icon="ph:map-pin-fill"
                /> */}

				{/* Birth Date */}
				<FloatingInput
					label="Birth Date"
					defaultValue="N/A"
					icon="ph:calendar-blank-fill"
				/>
			</div>
		</div>
	);
}
