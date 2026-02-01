// src/hooks/useToast.ts (Simplified)

"use client";

import { toast } from "sonner";

export function useToast() {
  return {
    success: (message: string, options?: Record<string, any>) =>
      toast.success(message, { ...options }),

    error: (message: string, options?: Record<string, any>) =>
      toast.error(message, { ...options }),

    info: (message: string, options?: Record<string, any>) =>
      toast.info(message, { ...options }), // Use default toast for info

    warning: (message: string, options?: Record<string, any>) =>
      toast.warning(message, { ...options }), // Use warning toast for warning
  };
}