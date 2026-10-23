// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Whole-naira amount as "₦12,500". */
export const formatNaira = (amount?: number | null) =>
	`₦${Math.round(amount ?? 0).toLocaleString("en-NG")}`;
