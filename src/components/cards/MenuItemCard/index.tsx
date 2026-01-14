"use client";

import { Badge } from "@/components/ui/badge";
import AddNewItemModal from "@/components/_modals/AddNewItemModal";

interface MenuItemCardProps {
    name: string;
    price: string | number;
    desc: string;
    isAvailable: boolean;
    category: string;
    image: string;
}

export default function MenuItemCard({ name, price, desc, isAvailable, category, image }: MenuItemCardProps) {
    return (
        <AddNewItemModal 
            mode="edit"
            categoryName={category}
            initialData={{ name, price: price.toString(), description: desc, isAvailable, category }}
            trigger={
                <div className="group bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full">
                    {/* Image Area */}
                    <div className="h-40 w-full bg-muted relative overflow-hidden">
                        <img 
                            src={image} 
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-4 flex flex-col flex-1">
                        <h4 className="font-semibold text-base text-foreground mb-1">{name}</h4>
                        <p className="text-xs text-muted-foreground mb-4">{desc}</p>
                        
                        <div className="mt-auto flex items-center gap-2">
                            <Badge 
                                variant="outline" 
                                className="bg-[#FFF1F2] text-[#FF5F5F] border-[#FFD6D6] rounded-md px-2.5 py-0.5 font-medium text-xs"
                            >
                                #{price}
                            </Badge>
                            
                            <Badge 
                                variant="outline"
                                className={`border-none rounded-md px-2.5 py-0.5 font-medium text-xs ${
                                    isAvailable 
                                    ? 'bg-[#E8F5E9] text-[#22C55E]' 
                                    : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {isAvailable ? 'Available' : 'Unavailable'}
                            </Badge>
                        </div>
                    </div>
                </div>
            }
        />
    );
}