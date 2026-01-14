"use client";

import MenuItemCard from "@/components/cards/MenuItemCard";
import AddItemCard from "@/components/cards/AddItemCard";
import MenuCategoryAccordion from "@/components/_atoms/MenuCategoryAccordion";

export default function MenuItemList() {
    return (
        <div className="space-y-4">
            {/* Category: Soup */}
            <MenuCategoryAccordion category="Soup" count="0 Item" />
            
            {/* Category: Swallow */}
            <MenuCategoryAccordion category="Swallow" count="5 Items" isOpen={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     <MenuItemCard 
                        name="Pounded yam" 
                        price="700" 
                        desc="Contain Cheese"
                        isAvailable={true} 
                        category="Swallow"
                        image="/assets/sample_food2.jpeg"
                    />
                     <MenuItemCard 
                        name="Pounded yam" 
                        price="700" 
                        desc="Contain Cheese"
                        isAvailable={true} 
                        category="Swallow"
                        image="/assets/sample_food2.jpeg"
                    />
                     <MenuItemCard 
                        name="Pounded yam" 
                        price="700" 
                        desc="Contain Cheese"
                        isAvailable={true} 
                        category="Swallow"
                        image="/assets/sample_food2.jpeg"
                    />
                    
                    {/* The Add Item Card at the end of the grid */}
                    <AddItemCard category="Swallow" />
                </div>
            </MenuCategoryAccordion>
            
            {/* Category: Breakfast */}
            <MenuCategoryAccordion category="Breakfast" count="3 Items">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     <MenuItemCard 
                        name="Fried Rice" 
                        price="1200" 
                        desc="Spicy rice"
                        isAvailable={false} 
                        category="Breakfast"
                         image="/assets/sample_food.jpg"
                    />
                     <AddItemCard category="Breakfast" />
                </div>
            </MenuCategoryAccordion>

            {/* Category: Protein */}
            <MenuCategoryAccordion category="Protein" count="5 Items" />
        </div>
    );
}