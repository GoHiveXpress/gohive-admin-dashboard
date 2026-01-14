"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import FloatingInput from "@/components/FormElements/FloatingInput";
import FloatingSelect from "@/components/FormElements/FloatingSelect";
import { SelectItem } from "@/components/ui/select";

export default function BusinessProfile() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Left Column: Form Fields */}
            <div className="space-y-6">
                <FloatingInput
                    label="Business Name"
                    defaultValue="Item7 Go"
                    icon="ph:storefront"
                />

                <FloatingSelect 
                    label="Business Type" 
                    defaultValue="restaurant"
                    icon="ph:storefront"
                >
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="grocery">Grocery</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                </FloatingSelect>

                <FloatingInput
                    label="Business Registration Number"
                    defaultValue="VGHV0923"
                    icon="ph:storefront" // Screenshot uses store icon, or use ph:hash
                />

                <FloatingInput
                    label="Business Address"
                    defaultValue="No 5 Alatise LA Offa"
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
                    <OperatingHourRow day="Monday" isOpen={true} />
                    <OperatingHourRow day="Tuesday" isOpen={true} />
                    <OperatingHourRow day="Wednesday" isOpen={true} />
                    <OperatingHourRow day="Thursday" isOpen={true} />
                    <OperatingHourRow day="Friday" isOpen={true} />
                    <OperatingHourRow day="Saturday" isOpen={true} />
                    <OperatingHourRow day="Sunday" isOpen={true} />
                </div>
            </div>
        </div>
    );
}

function OperatingHourRow({ day, isOpen: initialIsOpen }: { day: string, isOpen: boolean }) {
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    return (
        <div className="flex items-center justify-between py-1 bg-white">
            <div className="flex items-center gap-4 w-40">
                <Switch
                    checked={isOpen}
                    onCheckedChange={setIsOpen}
                    className="data-[state=checked]:bg-secondary scale-90"
                />
                <span className="text-sm font-medium text-foreground">{day}</span>
            </div>

            <div className="flex items-center gap-2 flex-1 justify-end">
                <div className="bg-[#123614] text-white rounded px-3 py-1.5 text-xs font-medium min-w-[60px] text-center">
                    8:00
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">AM</span>
                <span className="text-foreground font-bold mx-1">-</span>
                <div className="bg-[#123614] text-white rounded px-3 py-1.5 text-xs font-medium min-w-[60px] text-center">
                    12:00
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">PM</span>
            </div>
        </div>
    );
}