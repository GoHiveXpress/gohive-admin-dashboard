//src/components/Tabs/index.tsx
"use client";

import { cn } from "@/lib/utils";
import {Button} from "@/components/ui/button";

export interface TabItem {
  id: string;
  label: string;
}

interface CustomTabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export default function CustomTabs({ items, activeTab, onTabChange, className }: CustomTabsProps) {
  return (
    <div className={cn("flex items-center gap-2 bg-transparent", className)}>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <Button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            variant="ghost"
            className={cn(
              "rounded-full px-6 h-12 text-base font-medium transition-all duration-200",
              isActive 
                ? "bg-secondary text-white hover:bg-secondary/90 shadow-sm" 
                : "bg-transparent text-foreground hover:bg-accent"
            )}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}