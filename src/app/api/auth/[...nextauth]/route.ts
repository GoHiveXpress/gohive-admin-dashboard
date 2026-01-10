// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { nextAuthOptions } from "@src/lib/nextAuthOptions";

// In v5, NextAuth returns an object with a `handlers` property.
const { handlers } = NextAuth(nextAuthOptions);

// You must export the GET and POST handlers from the `handlers` object.
export const { GET, POST } = handlers;