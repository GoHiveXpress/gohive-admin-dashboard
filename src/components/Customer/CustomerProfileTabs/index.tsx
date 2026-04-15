"use client";

import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/FormElements/FloatingInput";

import { Customer } from "@/types/customerManagement";
import { format } from "date-fns";

export default function CustomerProfileTab({ customer }: { customer: Customer }) {
	const formattedDob = customer.dob ? format(new Date(customer.dob), "MMM d, yyyy") : "N/A";

	return (
		<div className="bg-white rounded-[20px] p-8 border border-border/50 shadow-sm relative">
			{/* Save Button removed as requested */}

			{/* Form Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl pt-6">
				<FloatingInput
					label="Full Name"
					icon="ph:user-bold"
					defaultValue={customer.name}
					readOnly
				/>

				<FloatingInput
					label="Phone Number"
					icon="ph:phone-bold"
					defaultValue={customer.phone}
					readOnly
				/>

				<FloatingInput
					label="Birth Date"
					icon="ph:calendar-blank-bold"
					defaultValue={formattedDob}
					readOnly
				/>

				<FloatingInput
					label="Email"
					icon="ph:envelope-simple-bold"
					type="email"
					defaultValue={customer.email}
					readOnly
				/>

				<FloatingInput
					label="Address"
					icon="ph:map-pin-bold"
					defaultValue={customer.location?.address || "N/A"}
					readOnly
				/>
			</div>
		</div>
	);
}
