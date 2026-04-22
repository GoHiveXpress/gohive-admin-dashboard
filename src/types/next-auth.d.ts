import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role?: string;
      /** The backend JWT token. */
      backendToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's role. */
    role?: string;
    /** The backend JWT token. */
    backendToken?: string;
  }
}
