"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FloatingSelectProps extends React.ComponentProps<typeof Select> {
    label: string;
    icon?: string;
    containerClassName?: string;
    placeholder?: string;
    children: React.ReactNode;
}

const FloatingSelect = ({
    label,
    icon,
    containerClassName,
    placeholder,
    children,
    ...props
}: FloatingSelectProps) => {
    return (
        <div className={cn("relative w-full group", containerClassName)}>
            {/* Label */}
            <label
                className={cn(
                    "absolute left-4 top-0 -translate-y-1/2 z-10 px-2 bg-white text-[10px] text-muted-foreground uppercase tracking-wider font-semibold pointer-events-none",
                )}
            >
                {label}
            </label>

            {/* Icon */}
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70 pointer-events-none z-20">
                    <Icon icon={icon} width="24" height="24" />
                </div>
            )}

            <Select {...props}>
                <SelectTrigger
                    className={cn(
                        "w-full rounded-2xl border border-border bg-white text-foreground font-medium h-14 shadow-sm focus:ring-1 focus:ring-secondary focus:border-secondary transition-all",
                        icon ? "pl-14" : "px-6"
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    {children}
                </SelectContent>
            </Select>
        </div>
    );
};

export default FloatingSelect;