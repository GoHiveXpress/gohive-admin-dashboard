// src/app/(gatedPages)/rider-management/page.tsx
import { type Metadata } from "next";
import RiderManagementClient from "./client";

export const metadata: Metadata = { title: "Riders" };

export default function RiderManagementPage() {
	return <RiderManagementClient />;
}
