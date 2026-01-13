"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type OrderCardData = {
    id: string;
    vendorName: string;
    time: string;
    eta: string;
    status: "Pending" | "Preparing" | "Delayed";
    items: string[];
};

interface AlertVendorCardProps {
    data: OrderCardData;
}

export default function AlertVendorCard({ data }: AlertVendorCardProps) {
    // Helper to determine styles based on status
    const getStatusStyles = (status: OrderCardData["status"]) => {
        switch (status) {
            case "Pending":
                return {
                    badgeBg: "bg-primary/10",
                    badgeText: "text-primary", // Yellow/Orange
                    dot: "bg-primary",
                };
            case "Preparing":
                return {
                    badgeBg: "bg-blue-100",
                    badgeText: "text-blue-500",
                    dot: "bg-blue-500",
                };
            case "Delayed":
                return {
                    badgeBg: "bg-destructive/10",
                    badgeText: "text-destructive",
                    dot: "bg-destructive",
                };
            default:
                return {
                    badgeBg: "bg-muted",
                    badgeText: "text-muted-foreground",
                    dot: "bg-gray-400",
                };
        }
    };

    const styles = getStatusStyles(data.status);

    return (
        <div className="bg-white rounded-[20px] p-5 border border-border/50 shadow-sm flex flex-col gap-4">
            {/* Header: Name, Time, Status */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-base font-bold text-foreground">{data.vendorName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">ETA: {data.eta}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        {data.time} <span className="font-normal text-muted-foreground">|</span>
                        <Badge 
                            variant="outline" 
                            className={`border-none px-3 py-1 rounded-full ${styles.badgeBg} ${styles.badgeText} hover:${styles.badgeBg}`}
                        >
                            <div className={`w-2 h-2 rounded-full mr-2 ${styles.dot}`} />
                            {data.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <hr className="border-border/50" />

            {/* Items List */}
            <div className="space-y-2 py-1">
                {data.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-foreground font-medium">
                        {item}
                    </p>
                ))}
            </div>

            {/* Action Button */}
            <Button 
                variant="outline" 
                className="w-full border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive mt-auto h-11 rounded-lg"
            >
                Alert Vendor
            </Button>
        </div>
    );
}