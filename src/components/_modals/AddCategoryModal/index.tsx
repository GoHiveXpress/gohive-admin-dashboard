//src/components/_modals/AddCategoryModal/index.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddCategoryModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white rounded-lg gap-2 h-10 px-4">
                    <Icon icon="ph:plus-circle" className="w-5 h-5" />
                    Add New Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] rounded-[20px] bg-[#F5F5F4] p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold">Add new category</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        {/* Using Select as per screenshot showing dropdown arrow */}
                        <Select>
                            <SelectTrigger className="h-12 rounded-xl bg-[#EBEBEB] border-none text-foreground">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="swallow">Swallow</SelectItem>
                                <SelectItem value="soup">Soup</SelectItem>
                                <SelectItem value="drinks">Drinks</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full bg-[#FF5F5F] hover:bg-[#FF5F5F]/90 text-white rounded-lg h-12 text-base font-medium">
                        Create New
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}