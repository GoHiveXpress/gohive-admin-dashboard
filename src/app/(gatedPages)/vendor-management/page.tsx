// src/app/(gatedPages)/vendor-management/page.tsx
import { type Metadata } from "next";
import VendorManagementClient from "./client";

export const metadata: Metadata = { title: "Vendors" };

export default function VendorManagementPage() {
	return <VendorManagementClient />;
}
