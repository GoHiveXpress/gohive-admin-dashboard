"use client";

import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/FormElements/FloatingInput";

export default function ProfileTab() {
    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center">
                <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 h-10">
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Full Name */}
                <FloatingInput
                    label="Full Name"
                    defaultValue="Victor Kenny"
                    icon="ph:user-fill"
                />

                {/* Phone Number */}
                <FloatingInput
                    label="Phone Number"
                    defaultValue="09056113019"
                    icon="ph:phone-fill"
                />

                {/* Email */}
                <FloatingInput
                    label="Email"
                    defaultValue="victorkenny@gmail.com"
                    icon="ph:envelope-simple-fill"
                />

                 {/* Address */}
                 <FloatingInput
                    label="Address"
                    defaultValue="No 5 Alatise LA Offa"
                    icon="ph:map-pin-fill"
                />

                 {/* Birth Date (Using generic input for styling match) */}
                 <FloatingInput
                    label="Birth Date"
                    defaultValue="Nov 2"
                    icon="ph:calendar-blank-fill"
                />
            </div>
        </div>
    );
}