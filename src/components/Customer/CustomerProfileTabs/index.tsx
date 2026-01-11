"use client";

import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/FormElements/FloatingInput";

export default function CustomerProfileTab() {
	return (
		<div className="bg-white rounded-[20px] p-8 border border-border/50 shadow-sm relative">
			{/* Save Button */}
			<div className="absolute top-4 right-6 z-10">
				<Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 h-10 font-medium text-sm transition-all shadow-sm">
					Save Changes
				</Button>
			</div>

			{/* Form Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl pt-14">
				<FloatingInput label="Full Name" icon="ph:user-bold" defaultValue="Victor Kenny" />

				<FloatingInput
					label="Phone Number"
					icon="ph:phone-bold"
					defaultValue="09056113019"
				/>

				<FloatingInput
					label="Birth Date"
					icon="ph:calendar-blank-bold"
					defaultValue="Nov 2"
				/>

				<FloatingInput
					label="Email"
					icon="ph:envelope-simple-bold"
					type="email"
					defaultValue="victorkenny@gmail.com"
				/>

				<FloatingInput
					label="Address"
					icon="ph:map-pin-bold"
					defaultValue="No 5 Alatise LA Offa"
				/>

				{/* Example of how easy it is to add a new field */}
				{/* 
        <FloatingInput 
          label="State" 
          icon="ph:buildings-bold" 
          defaultValue="Kwara" 
        /> 
        */}
			</div>
		</div>
	);
}
