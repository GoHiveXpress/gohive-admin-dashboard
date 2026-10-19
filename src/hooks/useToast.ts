// src/hooks/useToast.ts (Simplified)
/* eslint-disable @typescript-eslint/no-explicit-any, import/prefer-default-export */

"use client";

import { toast } from "sonner";

export function useToast() {
	return {
		success: (message: string, options?: Record<string, any>) =>
			toast.success(message, { ...options }),

		// Keyed by message so the same error (e.g. a 403 already toasted by the
		// axios interceptor) isn't shown twice.
		error: (message: string, options?: Record<string, any>) =>
			toast.error(message, { id: message, ...options }),

		info: (message: string, options?: Record<string, any>) =>
			toast.info(message, { ...options }), // Use default toast for info

		warning: (message: string, options?: Record<string, any>) =>
			toast.warning(message, { ...options }), // Use warning toast for warning
	};
}

/* eslint-enable */
