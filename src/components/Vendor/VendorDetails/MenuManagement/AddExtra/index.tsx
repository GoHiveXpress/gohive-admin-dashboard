"use client";

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddExtraModal from "@/components/_modals/AddExtraModal";

export default function AddExtraList() {
    return (
        <div className="space-y-4">
             {/* Extra Item 1 */}
            <ExtraItemRow 
                name="Plantain" 
                detail="Fried Plantain" 
                price="100" 
                isAvailable={true} 
            />

             {/* Extra Item 2 */}
            <ExtraItemRow 
                name="Moi Moi" 
                detail="Bean Pudding" 
                price="200" 
                isAvailable={true} 
            />

            {/* Dashed Add Button */}
            <AddExtraModal 
                mode="create"
                trigger={
                    <Button className="w-full h-14 border-dashed border-2 border-border bg-transparent text-muted-foreground hover:bg-muted/10 hover:border-primary/50 hover:text-primary rounded-xl mt-4">
                        <Icon icon="ph:plus" className="mr-2" />
                        Add New Extra
                    </Button>
                }
            />
        </div>
    );
}

function ExtraItemRow({ name, detail, price, isAvailable }: any) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-border shadow-sm gap-4">
            <span className="font-medium text-foreground">{name}</span>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Badge variant="secondary" className="bg-[#FFE4E6] text-[#BE123C] hover:bg-[#FFE4E6] border-none font-normal rounded-md">
                    {detail}
                </Badge>
                
                <Badge variant="outline" className="bg-[#FEFCE8] text-[#A16207] border-[#FEF08A] font-medium rounded-md">
                    ₦ {price}
                </Badge>
                
                <Badge className="bg-[#DCFCE7] text-[#15803D] hover:bg-[#DCFCE7] border-none shadow-none font-medium rounded-md">
                    {isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
                
                <div className="flex items-center gap-3 pl-2 sm:ml-4 border-l border-border/50">
                    <AddExtraModal 
                        mode="edit"
                        initialData={{ name: name, price: price, description: detail }}
                        trigger={
                            <Icon icon="ph:pencil-simple" className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors w-5 h-5" />
                        }
                    />
                    <Icon icon="ph:trash" className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors w-5 h-5" />
                </div>
            </div>
        </div>
    );
}