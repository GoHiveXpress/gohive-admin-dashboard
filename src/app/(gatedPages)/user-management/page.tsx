// src/app/(gatedPages)/user-management/page.tsx
import { Suspense } from "react";
import UserManagementClient from "./client";

// The client reads the active tab from useSearchParams, which needs a Suspense boundary.
export default function UserManagementPage() {
	return (
		<Suspense fallback={null}>
			<UserManagementClient />
		</Suspense>
	);
}
