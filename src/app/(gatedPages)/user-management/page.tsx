// src/app/(gatedPages)/user-management/page.tsx
import { type Metadata } from "next";
import { Suspense } from "react";
import UserManagementClient from "./client";

export const metadata: Metadata = { title: "Users" };

// The client reads the active tab from useSearchParams, which needs a Suspense boundary.
export default function UserManagementPage() {
	return (
		<Suspense fallback={null}>
			<UserManagementClient />
		</Suspense>
	);
}
