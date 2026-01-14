"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function KycVerificationTab() {
    return (
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-border/50 min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                
                {/* Left Column: Document Upload */}
                <div className="border border-border/60 rounded-[20px] p-6 h-fit">
                    <h3 className="font-medium text-base text-foreground mb-6">Document Upload</h3>
                    
                    <div className="space-y-1">
                        <DocumentRow 
                            number="1" 
                            label="NIN" 
                            status="view" 
                        />
                        <DocumentRow 
                            number="2" 
                            label="Passport" 
                            status="view" 
                        />
                        <DocumentRow 
                            number="3" 
                            label="Business License" 
                            status="missing" 
                        />
                        <DocumentRow 
                            number="4" 
                            label="Tax Information" 
                            status="missing" 
                            isLast
                        />
                    </div>
                </div>

                {/* Right Column: Access Panel */}
                <div className="border border-border/60 rounded-[20px] p-6 h-fit">
                    <h3 className="font-medium text-base text-foreground mb-6">Access Panel</h3>
                    
                    <div className="space-y-6">
                        {/* Status Dropdown */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-foreground">Set Status</Label>
                            <Select defaultValue="approved">
                                <SelectTrigger className="h-12 rounded-xl border-border bg-white">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Comment Box */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-foreground">Comment</Label>
                            <Textarea 
                                placeholder="Input comment" 
                                className="min-h-[140px] rounded-xl border-border bg-white resize-none p-4"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button 
                                variant="outline" 
                                className="flex-1 h-12 rounded-full border-border bg-[#F9FAFB] hover:bg-[#F3F4F6] text-foreground font-medium"
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 h-12 rounded-full bg-[#419A44] hover:bg-[#419A44]/90 text-white font-medium"
                            >
                                Save
                            </Button>
                        </div>
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
                <div className="w-8 h-8 rounded-full border border-foreground/80 flex items-center justify-center text-sm font-medium text-foreground">
                    {number}
                </div>
                <span className="font-medium text-sm text-foreground">{label}</span>
            </div>

            {status === "view" ? (
                <Button 
                    variant="outline" 
                    className="h-9 px-4 rounded-full border-border text-foreground hover:bg-muted gap-2 text-sm font-normal"
                >
                    <Icon icon="ph:eye" className="w-4 h-4" />
                    View
                </Button>
            ) : (
                <div className="h-9 px-4 flex items-center justify-center rounded-full border border-border/50 bg-[#F5F5F4] text-muted-foreground text-[10px] sm:text-xs font-medium italic">
                    Not Uploaded Yet
                </div>
            )}
        </div>
    );
}