// src/app/(gatedPages)/active-users/page.tsx
import { type Metadata } from "next";
import ActiveUsersClient from "./client";

export const metadata: Metadata = { title: "Active Users" };

export default function ActiveUsersPage() {
	return <ActiveUsersClient />;
}
