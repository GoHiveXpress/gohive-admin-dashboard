"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	icon?: string;
	containerClassName?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
	({ className, containerClassName, label, icon, type, ...props }, ref) => {
		return (
			<div className={cn("relative w-full group", containerClassName)}>
				{/* Label - Sits on the border */}
				<label
					className={cn(
						"absolute left-4 top-0 -translate-y-1/2 z-10 px-2 bg-white text-[10px] text-muted-foreground uppercase tracking-wider font-semibold pointer-events-none",
						// Optional: Add peer-focus color change if you want active state styling
						"peer-focus:text-secondary",
					)}
				>
					{label}
				</label>

				{/* Icon */}
				{icon && (
					<div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70 pointer-events-none">
						<Icon icon={icon} width="24" height="24" />
					</div>
				)}

				{/* Input Field */}
				<Input
					type={type}
					className={cn(
						"peer block w-full rounded-2xl border border-border bg-white text-foreground font-medium h-14 shadow-sm focus-visible:ring-1 focus-visible:ring-secondary focus-visible:border-secondary transition-all",
						// Padding logic for icon
						icon ? "pl-14 pr-4" : "px-6",
						className,
					)}
					ref={ref}
					{...props}
				/>
			</div>
		);
	},
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
