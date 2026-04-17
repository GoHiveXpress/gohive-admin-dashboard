// src/components/Tabs/index.tsx

"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
		<div
			className={cn(
				"flex w-full items-center gap-2 overflow-x-auto whitespace-nowrap bg-transparent scrollbar-hide",
				className
			)}
			style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
		>
			<style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
			{items.map((item) => {
				const isActive = activeTab === item.id;
				return (
					<Button
						key={item.id}
						onClick={() => onTabChange(item.id)}
						variant="ghost"
						className={cn(
							"shrink-0 rounded-full h-10 px-4 text-xs sm:h-12 sm:px-6 sm:text-base font-medium transition-all duration-200",
							isActive
								? "bg-secondary text-white hover:bg-secondary/90 shadow-sm"
								: "bg-transparent text-foreground hover:bg-accent hover:text-foreground",
						)}
					>
						{item.label}
					</Button>
				);
			})}
		</div>
	);
}
