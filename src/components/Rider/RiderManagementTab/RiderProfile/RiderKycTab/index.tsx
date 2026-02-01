//src/components/Rider/RiderManagementTab/RiderProfile/RiderKycTab/index.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiderUser } from "@/types/riderManagement";
import { useUpdateRiderStatus } from "@/hooks/riderManagement";
import { Loader2 } from "lucide-react";

interface RiderKycTabProps {
    rider: RiderUser;
}

export default function RiderKycTab({ rider }: RiderKycTabProps) {
    // Initialize status from API data
    const [status, setStatus] = useState<string>(
        rider.riderProfile.verificationStatus || 
        (rider.riderProfile.isApproved ? "approved" : "pending")
    );
    const [comment, setComment] = useState("");

    const { mutate: updateStatus, isPending } = useUpdateRiderStatus();

    const handleSave = () => {
        updateStatus({
            id: rider._id,
            status: status as "pending" | "approved" | "rejected"
        });
        // Note: Comment logic would go here if API supported it
    };

    // Document Helpers
    const profile = rider.riderProfile;
    const hasLicense = !!profile.driversLicenseImage;
    const hasPassport = !!profile.passportPhoto;
    const hasBikeImage = !!profile.vehicleImage;
    // Plate number is text, not file, so we check if string exists
    const hasPlateNumber = !!profile.vehiclePlateNumber; 

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Document Upload */}
            <div className="border border-border/60 rounded-[20px] p-6 h-fit">
                <h3 className="font-medium text-sm text-foreground mb-6">Document Upload</h3>
                
                <div className="space-y-1">
                    {/* Assuming NIN isn't in model, marking as missing or mapping to a different field */}
                    <DocumentRow number="1" label="NIN" status="missing" />
                    
                    <DocumentRow 
                        number="2" 
                        label="Passport" 
                        status={hasPassport ? "view" : "missing"} 
                        viewLink={profile.passportPhoto}
                    />
                    
                    {/* Plate number is usually just text, but if it was an image: */}
                    <DocumentRow 
                        number="3" 
                        label={`Plate: ${profile.vehiclePlateNumber || "N/A"}`} 
                        status={hasPlateNumber ? "view" : "missing"} 
                        // View link disabled for text-only data
                        viewLink="#"
                    />
                    
                    <DocumentRow 
                        number="4" 
                        label="Bike Image" 
                        status={hasBikeImage ? "view" : "missing"} 
                        viewLink={profile.vehicleImage}
                    />
                    
                    <DocumentRow 
                        number="5" 
                        label="Driver's License" 
                        status={hasLicense ? "view" : "missing"} 
                        viewLink={profile.driversLicenseImage}
                        isLast 
                    />
                </div>
            </div>

            {/* Right Column: Access Panel */}
            <div className="border border-border/60 rounded-[20px] p-6 h-fit">
                <h3 className="font-medium text-sm text-foreground mb-6">Access Panel</h3>
                
                <div className="space-y-6">
                    {/* Status Dropdown - Using Standard Select to ensure controlled state works perfectly */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-foreground ml-1">Set Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="h-12 rounded-xl border-border bg-white w-full">
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
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-foreground ml-1">Comment</Label>
                        <Textarea 
                            placeholder="Input comment" 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
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
                            onClick={handleSave}
                            disabled={isPending}
                            className="flex-1 h-12 rounded-full bg-secondary hover:bg-secondary/90 text-white font-medium"
                        >
                             {isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
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
    viewLink?: string;
}

function DocumentRow({ number, label, status, isLast, viewLink }: DocumentRowProps) {
    return (
        <div className={`flex items-center justify-between py-5 ${!isLast ? 'border-b border-border/40' : ''}`}>
            <div className="flex items-center gap-4">
                {/* Number Circle */}
                <div className="w-8 h-8 rounded-full border border-foreground/80 flex items-center justify-center text-xs font-medium text-foreground">
                    {number}
                </div>
                <span className="font-medium text-xs sm:text-sm text-foreground">{label}</span>
            </div>

            {status === "view" && viewLink && viewLink !== "#" ? (
                <a href={viewLink} target="_blank" rel="noopener noreferrer">
                    <Button 
                        variant="outline" 
                        className="h-9 px-4 rounded-full border-border text-foreground hover:bg-muted gap-2 text-xs font-normal"
                    >
                        <Icon icon="ph:eye" className="w-4 h-4" />
                        View
                    </Button>
                </a>
            ) : (
                <div className="h-9 px-4 flex items-center justify-center rounded-full border border-border/50 bg-[#F5F5F4] text-muted-foreground text-[10px] font-medium italic">
                    {status === "missing" ? "Not Uploaded Yet" : "No File"}
                </div>
            )}
        </div>
    );
}