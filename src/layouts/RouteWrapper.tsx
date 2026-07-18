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
	top: "flex flex-col items-start gap-5 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-800",
	middle: "grid grid-cols-1 gap-6 xl:gap-8",
	// Update children style to be flexible
	children: "flex min-h-0 w-full flex-1 flex-col",
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
		<section
			className={cn(
				"flex h-full w-full flex-col gap-6 xl:gap-8",
				!hasSlots && "gap-0",
			)}
		>
			{/* Only render grid if top slots exist */}
			{(!!topLeftSlot || !!topRightSlot) && (
				<div className="mt-2 grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
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
