"use client";

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { Icon } from "@iconify/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";


interface MenuCategoryAccordionProps {
	category: string;
	count: string;
	isOpen?: boolean;
	children?: React.ReactNode;
}

export default function MenuCategoryAccordion({
	category,
	count,
	isOpen = false,
	children,
}: MenuCategoryAccordionProps) {
	return (
		<Accordion
			type="single"
			collapsible
			defaultValue={isOpen ? category : undefined}
			className="border-border w-full overflow-hidden rounded-xl border bg-white shadow-sm"
		>
			<AccordionItem value={category} className="border-none">
				<div className="flex items-center justify-between bg-white px-6 py-4">
					<div className="flex flex-1 items-center gap-4">
						<span className="text-foreground text-base font-semibold">{category}</span>
						<span className="text-muted-foreground text-xs">{count}</span>
					</div>

					<div className="flex items-center gap-3">
						<AccordionTrigger className="text-muted-foreground py-0 pl-2 pr-0 hover:no-underline" />
					</div>
				</div>
				<AccordionContent className="border-border/40 border-t bg-[#FAFAFA] px-6 pb-6 pt-0">
					<div className="pt-6">
						{children || (
							<div className="text-muted-foreground py-6 text-center text-sm">
								No items in this category.
							</div>
						)}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

/* eslint-enable */
