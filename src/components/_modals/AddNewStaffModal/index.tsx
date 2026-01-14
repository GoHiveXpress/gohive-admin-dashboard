"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import FloatingInput from "@/components/FormElements/FloatingInput";
import FloatingSelect from "@/components/FormElements/FloatingSelect";
import { SelectItem } from "@/components/ui/select";

export default function AddNewStaffModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 gap-2">
                    <Icon icon="ph:plus-circle" className="w-5 h-5" />
                    Add New Staff
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] rounded-[24px] p-0 overflow-hidden bg-[#FAFAF9]">
                <DialogHeader className="p-6 bg-white border-b border-border/50">
                    <DialogTitle className="text-xl font-semibold">Add New Staff</DialogTitle>
                </DialogHeader>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white m-6 rounded-[20px]">
                    <FloatingInput
                        label="Full Name"
                        placeholder="Enter name"
                        icon="ph:user-fill"
                    />
                     <FloatingSelect
                        label="Role Assigned"
                        placeholder="Manager"
                        icon="ph:user-gear-fill"
                    >
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="kitchen">Kitchen Assistant</SelectItem>
                        <SelectItem value="waiter">Waiter</SelectItem>
                    </FloatingSelect>

                    <FloatingInput
                        label="Email"
                        type="email"
                        placeholder="Enter email"
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
                        icon="ph:phone-fill"
                        placeholder="Enter phone"
                    />

                     {/* Set Permissions Button Mock */}
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
                        Add Staff
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}