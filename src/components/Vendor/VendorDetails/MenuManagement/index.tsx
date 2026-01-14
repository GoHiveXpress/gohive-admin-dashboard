"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import AddCategoryModal from "@/components/_modals/AddCategoryModal";
import MenuItemList from "./MenuItem";
import AddExtraList from "./AddExtra";

const MENU_SUB_TABS = [
    { label: "Menu Items", value: "Menu Items" },
    { label: "Add Extra", value: "Add Extra" }
];

export default function MenuManagementTab() {
    const [activeSubTab, setActiveSubTab] = useState("Menu Items");

    return (
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-border/50 min-h-[600px]">
            {/* Header / Toolbar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                
                {/* Sub Tabs */}
                <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-full">
                     {MENU_SUB_TABS.map((tab) => {
                        const isActive = activeSubTab === tab.value;
                        return (
                            <Button
                                key={tab.value}
                                onClick={() => setActiveSubTab(tab.value)}
                                variant="ghost"
                                className={`rounded-full h-10 px-6 text-sm font-semibold transition-all ${
                                    isActive 
                                    ? "bg-[#123614] text-white hover:bg-[#123614]/90 shadow-md" 
                                    : "text-muted-foreground hover:bg-white hover:text-foreground"
                                }`}
                            >
                                {tab.label}
                            </Button>
                        )
                    })}
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                    {/* Filter Button */}
                    <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 rounded-lg border-border">
                        <Icon icon="ph:sliders-horizontal" className="w-5 h-5" />
                    </Button>

                    {/* Quick Filters */}
                    <Button className="h-10 rounded-lg bg-[#F97316] text-white hover:bg-[#F97316]/90 font-medium px-6">
                        All
                    </Button>
                    <Button variant="outline" className="h-10 rounded-lg border-border font-medium px-6">
                        A-Z
                    </Button>

                    <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                         <Icon icon="ph:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                         <Input placeholder="Search" className="pl-10 h-10 rounded-lg border-border bg-white" />
                    </div>

                    {/* Add Category Trigger */}
                    <div className="w-full sm:w-auto">
                        <AddCategoryModal />
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in zoom-in-95 duration-200">
                {activeSubTab === "Menu Items" && <MenuItemList />}
                {activeSubTab === "Add Extra" && <AddExtraList />}
            </div>
        </div>
    );
}