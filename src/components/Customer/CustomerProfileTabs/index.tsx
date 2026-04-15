"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing */

import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/FormElements/FloatingInput";

import { type Customer } from "@/types/customerManagement";
import { format } from "date-fns";

export default function CustomerProfileTab({ customer }: { customer: Customer }) {
	const formattedDob = customer.dob ? format(new Date(customer.dob), "MMM d, yyyy") : "N/A";

	return (
		<div className="border-border/50 relative rounded-[20px] border bg-white p-8 shadow-sm">
			{/* Save Button removed as requested */}

			{/* Form Grid */}
			<div className="grid max-w-4xl grid-cols-1 gap-x-8 gap-y-6 pt-6 md:grid-cols-2">
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

/* eslint-enable */
