// src/lib/nextAuthOptions.ts
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import env from "@src/env"; 

export const nextAuthOptions: NextAuthConfig = {

  secret: env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter both email and password.");
          }
      
          // Direct Axios call to your Backend
          const response = await axios.post(
            `${env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );
      
          const data = response.data;
      
          // ✅ FIX: Check data.token directly (not data.data.token)
          // Your backend returns: { success: true, token: "...", user: {...} }
          if (!data.success || !data.token) {
            console.warn("Login failed:", data.message);
            return null;
          }
      
          // ✅ FIX: Map fields directly from root object
          return {
            id: data.user?._id,
            name: `${data.user?.firstName ?? ""} ${data.user?.lastName ?? ""}`,
            email: data.user?.email,
            role: data.user?.role, 
            backendToken: data.token,
          };
        } catch (error: any) {
          const backendMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Unable to sign in. Please try again.";
      
          console.error("Login authorize() error:", backendMessage);
          return null;
        }
      }
      
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = (user as any).backendToken;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role as string,
        backendToken: token.backendToken as string,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};