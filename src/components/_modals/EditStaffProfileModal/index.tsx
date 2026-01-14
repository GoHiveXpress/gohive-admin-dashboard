"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import FloatingInput from "@/components/FormElements/FloatingInput";
import FloatingSelect from "@/components/FormElements/FloatingSelect";
import { SelectItem } from "@/components/ui/select";
import { StaffData } from "../../Vendor/VendorDetails/ProfileManagement/StaffProfile";

interface EditStaffProps {
    staff: StaffData;
}

export default function EditStaffProfileModal({ staff }: EditStaffProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Icon icon="ph:pencil-simple-bold" width="20" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] rounded-[24px] p-0 overflow-hidden bg-[#FAFAF9]">
                <DialogHeader className="p-6 bg-white border-b border-border/50">
                    <DialogTitle className="text-xl font-semibold">Staff Profile</DialogTitle>
                </DialogHeader>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white m-6 rounded-[20px]">
                    <FloatingInput
                        label="Full Name"
                        defaultValue={staff.name}
                        icon="ph:user-fill"
                    />
                     <FloatingSelect
                        label="Role Assigned"
                        defaultValue={staff.role === "Manager" ? "manager" : "kitchen"}
                        icon="ph:user-gear-fill"
                    >
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="kitchen">Kitchen Assistant</SelectItem>
                        <SelectItem value="waiter">Waiter</SelectItem>
                    </FloatingSelect>

                    <FloatingInput
                        label="Email"
                        type="email"
                        defaultValue={staff.email}
                        icon="ph:envelope-simple-fill"
                    />

                    <FloatingInput
                        label="Passport Phot"
                        readOnly
                        icon="ph:upload-simple-bold"
                        placeholder="Upload"
                    />

                    <FloatingInput
                        label="Phone Number"
                        defaultValue="09056113019"
                        icon="ph:phone-fill"
                    />

                    <Button className="h-14 w-full bg-secondary hover:bg-secondary/90 text-white rounded-xl flex items-center justify-center gap-2 font-medium">
                        <Icon icon="ph:key-fill" className="w-5 h-5" />
                        Set Permissions
                    </Button>
                </div>

                <DialogFooter className="p-6 bg-white border-t border-border/50 gap-4">
                    <DialogClose asChild>
                         <Button variant="outline" className="flex-1 h-12 rounded-xl bg-[#E6E8E6] border-none text-muted-foreground hover:bg-[#dcdedc]">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" className="flex-1 h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-white">
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}