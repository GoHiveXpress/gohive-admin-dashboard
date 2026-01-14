"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface AddExtraModalProps {
    mode?: "create" | "edit";
    trigger?: React.ReactNode;
    initialData?: {
        name: string;
        price: string;
        description: string;
    };
}

export default function AddExtraModal({ 
    mode = "create", 
    trigger,
    initialData 
}: AddExtraModalProps) {
    const isEdit = mode === "edit";

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-[#419A44] hover:bg-[#419A44]/90 text-white rounded-lg w-full">
                        Add Extra
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[24px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-border/40">
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Edit Extra" : "Add New Extra"}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground/80">Name</Label>
                        <Input 
                            defaultValue={initialData?.name} 
                            placeholder="e.g Plantain" 
                            className="h-12 rounded-xl bg-white border-border" 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground/80">Price</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                            <Input 
                                defaultValue={initialData?.price} 
                                placeholder="00.00" 
                                className="pl-8 h-12 rounded-xl bg-white border-border" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground/80">Description</Label>
                        <Textarea 
                            defaultValue={initialData?.description} 
                            placeholder="e.g Fried Plantain" 
                            className="min-h-[100px] resize-none rounded-xl bg-white border-border p-3" 
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 gap-3">
                     <DialogClose asChild>
                        <Button variant="outline" className="flex-1 rounded-xl h-12 bg-[#D1D5DB]/30 border-none text-foreground/70 hover:bg-[#D1D5DB]/50">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" className="flex-1 bg-[#419A44] hover:bg-[#419A44]/90 text-white rounded-xl h-12">
                        {isEdit ? "Save Changes" : "Add Extra"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}