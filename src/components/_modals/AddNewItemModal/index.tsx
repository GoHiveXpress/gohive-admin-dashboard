//src/components/_modals/AddNewItemModal/index.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface AddItemProps {
    mode?: "create" | "edit";
    categoryName?: string;
    trigger?: React.ReactNode;
    initialData?: {
        name: string;
        price: string;
        description: string;
        isAvailable: boolean;
        category: string;
    };
}

export default function AddNewItemModal({ 
    mode = "create", 
    categoryName, 
    trigger,
    initialData 
}: AddItemProps) {
    const isEdit = mode === "edit";
    const [availability, setAvailability] = useState<"available" | "unavailable">(
        initialData?.isAvailable === false ? "unavailable" : "available"
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="h-8 gap-1 rounded-full text-xs">
                        <Icon icon="ph:plus" /> Add Item
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] rounded-[24px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-border/40">
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="p-6 space-y-5">
                    {/* Image Upload Area */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground/80">Item Image</Label>
                        <div className="h-40 border border-border rounded-xl flex flex-col items-center justify-center overflow-hidden bg-muted/5 relative group cursor-pointer">
                            {isEdit ? (
                                // Mock Image for Edit Mode
                                <img 
                                    src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1000&auto=format&fit=crop" 
                                    alt="Item" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground">
                                    <Icon icon="ph:image" className="w-8 h-8 mb-2" />
                                    <span className="text-xs">Click to upload image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground/80">Item Name</Label>
                            <Input 
                                defaultValue={initialData?.name}
                                placeholder={isEdit ? "Fried Rice" : "e.g Fried Rice"} 
                                className="h-12 rounded-xl border-border bg-white" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground/80">Price</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                                <Input 
                                    defaultValue={initialData?.price}
                                    placeholder="00.00" 
                                    className="pl-8 h-12 rounded-xl border-border bg-white" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground/80">Category</Label>
                        <div className="flex gap-2 flex-wrap">
                            {['Swallow', 'Extra', 'Protein', 'Drinks', 'Lunch', 'Breakfast'].map(tag => {
                                const isActive = tag === (categoryName || initialData?.category || 'Swallow');
                                return (
                                    <Badge 
                                        key={tag} 
                                        variant="outline" 
                                        className={`cursor-pointer px-5 py-2 rounded-full font-normal border ${
                                            isActive 
                                            ? 'bg-[#419A44] text-white border-[#419A44]' 
                                            : 'bg-white text-foreground border-border hover:bg-muted'
                                        }`}
                                    >
                                        {tag}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground/80">Description</Label>
                        <Textarea 
                            defaultValue={initialData?.description}
                            placeholder="e.g Fried Plantain" 
                            className="h-24 resize-none rounded-xl border-border bg-white p-3" 
                        />
                    </div>

                     <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground/80">Availability</Label>
                        <div className="flex gap-4">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setAvailability("available")}
                                className={`flex-1 rounded-xl h-11 border ${
                                    availability === "available"
                                    ? "bg-[#E8F5E9] text-[#419A44] border-[#419A44] hover:bg-[#E8F5E9]"
                                    : "bg-white text-muted-foreground border-border"
                                }`}
                            >
                                Available
                            </Button>
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => setAvailability("unavailable")}
                                className={`flex-1 rounded-xl h-11 border ${
                                    availability === "unavailable"
                                    ? "bg-[#E8F5E9] text-[#419A44] border-[#419A44] hover:bg-[#E8F5E9]"
                                    : "bg-white text-muted-foreground border-border"
                                }`}
                            >
                                Unavailable
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 gap-3">
                     <DialogClose asChild>
                        <Button variant="outline" className="flex-1 rounded-xl h-12 bg-[#D1D5DB]/30 border-none text-foreground/70 hover:bg-[#D1D5DB]/50">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" className="flex-1 bg-[#419A44] hover:bg-[#419A44]/90 text-white rounded-xl h-12">
                        {isEdit ? "Save Changes" : "Add Item"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}