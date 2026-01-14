"use client";

import { Icon } from "@iconify/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AddNewItemModal from "@/components/_modals/AddNewItemModal";

interface MenuCategoryAccordionProps {
    category: string;
    count: string;
    isOpen?: boolean;
    children?: React.ReactNode;
}

export default function MenuCategoryAccordion({ category, count, isOpen = false, children }: MenuCategoryAccordionProps) {
    return (
        <Accordion type="single" collapsible defaultValue={isOpen ? category : undefined} className="w-full border border-border rounded-xl bg-white overflow-hidden shadow-sm">
            <AccordionItem value={category} className="border-none">
                <div className="flex items-center justify-between px-6 py-4 bg-white">
                    <div className="flex items-center gap-4 flex-1">
                        <span className="font-semibold text-base text-foreground">{category}</span>
                        <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         {/* Header Actions */}
                         <AddNewItemModal 
                            mode="create" 
                            categoryName={category}
                            trigger={
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                    <Icon icon="ph:plus-bold" width="18" />
                                </button>
                            } 
                        />
                         
                         <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Icon icon="ph:pencil-simple-bold" width="18" />
                         </button>
                         <button className="text-muted-foreground hover:text-destructive transition-colors">
                            <Icon icon="ph:trash-bold" width="18" />
                         </button>
                         
                         <AccordionTrigger className="hover:no-underline py-0 pr-0 pl-2 text-muted-foreground" />
                    </div>
                </div>
                <AccordionContent className="px-6 pb-6 pt-0 border-t border-border/40 bg-[#FAFAFA]">
                    <div className="pt-6">
                        {children || <div className="text-center text-muted-foreground py-6 text-sm">No items in this category.</div>}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}