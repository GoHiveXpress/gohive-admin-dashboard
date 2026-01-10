// src/layouts/RouteWrapper.tsx
import { cn } from "@/lib/utils"; 
import { type ReactNode } from "react";

interface RouteWrapperProps {
	topLeftSlot?: ReactNode;
	topRightSlot?: ReactNode;
	middleSlot?: ReactNode;
	children?: ReactNode;
}

const baseStyles = {
	top: "flex flex-col items-start gap-4 p-4 sm:p-6 lg:col-span-2 rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-800",
	middle: "grid grid-cols-1 gap-6",
	// Update children style to be flexible
	children: "flex flex-col flex-1 min-h-0 w-full",
};

export default function RouteWrapper({
	topLeftSlot,
	topRightSlot,
	middleSlot,
	children,
}: RouteWrapperProps = {}) {
	// Check if slots are used to adjust layout mode
	const hasSlots = !!topLeftSlot || !!topRightSlot || !!middleSlot;

	return (
		<section className={cn("flex flex-col gap-6 w-full h-full", !hasSlots && "p-0 gap-0")}>
			{/* Only render grid if top slots exist */}
			{(!!topLeftSlot || !!topRightSlot) && (
				<div className="mt-4 grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
					{!!topLeftSlot && <div className={cn(baseStyles.top)}>{topLeftSlot}</div>}
					{!!topRightSlot && <div className={cn(baseStyles.top)}>{topRightSlot}</div>}
				</div>
			)}

			{!!middleSlot && <div className={cn(baseStyles.middle, "shrink-0")}>{middleSlot}</div>}

			{/* Children slot - Takes remaining space */}
			{children && <div className={cn(baseStyles.children)}>{children}</div>}
		</section>
	);
}
