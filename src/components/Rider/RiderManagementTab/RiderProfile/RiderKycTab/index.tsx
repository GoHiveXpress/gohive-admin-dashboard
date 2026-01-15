"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { Textarea } from "@/components/ui/textarea";
import { SelectItem } from "@/components/ui/select";
import FloatingSelect from "@/components/FormElements/FloatingSelect";

export default function RiderKycTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Document Upload */}
            <div className="border border-border/60 rounded-[20px] p-6 h-fit">
                <h3 className="font-medium text-sm text-foreground mb-6">Document Upload</h3>
                
                <div className="space-y-1">
                    <DocumentRow number="1" label="NIN" status="view" />
                    <DocumentRow number="2" label="Passport" status="view" />
                    <DocumentRow number="3" label="Plate Number" status="missing" />
                    <DocumentRow number="4" label="Bike Image" status="missing" />
                    <DocumentRow number="5" label="Government Issued ID" status="missing" isLast />
                </div>
            </div>

            {/* Right Column: Access Panel */}
            <div className="border border-border/60 rounded-[20px] p-6 h-fit">
                <h3 className="font-medium text-sm text-foreground mb-6">Access Panel</h3>
                
                <div className="space-y-6">
                    {/* Status Dropdown */}
                    <FloatingSelect
                        label="Set Status"
                        defaultValue="approved"
                    >
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </FloatingSelect>

                    {/* Comment Box */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-foreground ml-1">Comment</Label>
                        <Textarea 
                            placeholder="Input comment" 
                            className="min-h-[120px] rounded-2xl border-border bg-white resize-none p-4 focus-visible:ring-secondary"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                        <Button 
                            variant="outline" 
                            className="flex-1 h-12 rounded-full border-border bg-[#F9FAFB] hover:bg-[#F3F4F6] text-foreground font-medium"
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1 h-12 rounded-full bg-secondary hover:bg-secondary/90 text-white font-medium"
                        >
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
}

function DocumentRow({ number, label, status, isLast }: DocumentRowProps) {
    return (
        <div className={`flex items-center justify-between py-5 ${!isLast ? 'border-b border-border/40' : ''}`}>
            <div className="flex items-center gap-4">
                {/* Number Circle */}
                <div className="w-8 h-8 rounded-full border border-foreground/80 flex items-center justify-center text-xs font-medium text-foreground">
                    {number}
                </div>
                <span className="font-medium text-xs sm:text-sm text-foreground">{label}</span>
            </div>

            {status === "view" ? (
                <Button 
                    variant="outline" 
                    className="h-9 px-4 rounded-full border-border text-foreground hover:bg-muted gap-2 text-xs font-normal"
                >
                    <Icon icon="ph:eye" className="w-4 h-4" />
                    View
                </Button>
            ) : (
                <div className="h-9 px-4 flex items-center justify-center rounded-full border border-border/50 bg-[#F5F5F4] text-muted-foreground text-[10px] font-medium italic">
                    Not Uploaded Yet
                </div>
            )}
        </div>
    );
}