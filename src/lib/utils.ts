import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Removed 'export function cn' to avoid "no-named-as-default" lint error
export default function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
