// src/utils/auth.ts
"use client";

import { getSession } from "next-auth/react";

export const AUTH_TOKEN_KEY = "token";

export async function getAuthToken(): Promise<string | null> {
  // 1. Try NextAuth Session first
  const session = await getSession();
  if (session?.user && "backendToken" in session.user) {
    return (session.user as any).backendToken;
  }

  // 2. Fallback to LocalStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  return null; 
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

// ✅ Crucial for logout
export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}