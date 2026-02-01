//src/components/Vendor/VendorDetails/ProfileManagement/BusinessProfile/index.tsx
"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import FloatingInput from "@/components/FormElements/FloatingInput";
import FloatingSelect from "@/components/FormElements/FloatingSelect";
import { SelectItem } from "@/components/ui/select";
import { VendorUser, OperatingHours } from "@/types/vendorManagement";

interface BusinessProfileProps {
    vendor: VendorUser;
}

export default function BusinessProfile({ vendor }: BusinessProfileProps) {
    const profile = vendor.vendorProfile;
    const hours = profile.operatingHours || [];

    // Helper to find specific day hours or default
    const getDayHours = (day: string) => {
        return hours.find(h => h.day === day) || { day, isOpen: false, openTime: "09:00 AM", closeTime: "09:00 PM", is24Hours: false };
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Left Column: Form Fields */}
            <div className="space-y-6">
                <FloatingInput
                    label="Business Name"
                    defaultValue={profile.businessName}
                    icon="ph:storefront"
                />

                <FloatingSelect 
                    label="Business Type" 
                    defaultValue={profile.businessType || "restaurant"} // Default fallback
                    icon="ph:storefront"
                >
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="grocery">Grocery</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                </FloatingSelect>

                <FloatingInput
                    label="Business Registration Number"
                    defaultValue={profile.cacNumber}
                    icon="ph:hash" 
                />

                <FloatingInput
                    label="Business Address"
                    defaultValue={profile.businessAddress}
                    icon="ph:map-pin-fill"
                />
            </div>

            {/* Right Column: Operating Hours */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                    <Icon icon="ph:clock" className="text-secondary w-5 h-5" />
                    <h3 className="font-medium text-foreground">Operating hours</h3>
                </div>

                <div className="space-y-3">
                    {daysOfWeek.map(day => (
                        <OperatingHourRow key={day} data={getDayHours(day)} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function OperatingHourRow({ data }: { data: OperatingHours }) {
    const [isOpen, setIsOpen] = useState(data.isOpen);

    // Parse time for display (Assuming format "HH:mm AM")
    const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        return { time, period };
    };

    const start = parseTime(data.openTime);
    const end = parseTime(data.closeTime);

    return (
        <div className="flex items-center justify-between py-1 bg-white">
            <div className="flex items-center gap-4 w-40">
                <Switch
                    checked={isOpen}
                    onCheckedChange={setIsOpen}
                    className="data-[state=checked]:bg-secondary scale-90"
                />
                <span className="text-sm font-medium text-foreground">{data.day}</span>
            </div>

            <div className="flex items-center gap-2 flex-1 justify-end">
                <div className="bg-[#123614] text-white rounded px-3 py-1.5 text-xs font-medium min-w-[60px] text-center">
                    {start.time}
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">{start.period}</span>
                <span className="text-foreground font-bold mx-1">-</span>
                <div className="bg-[#123614] text-white rounded px-3 py-1.5 text-xs font-medium min-w-[60px] text-center">
                    {end.time}
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">{end.period}</span>
            </div>
        </div>
    );
}