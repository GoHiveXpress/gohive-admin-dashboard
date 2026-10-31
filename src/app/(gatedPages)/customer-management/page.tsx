// src/app/(gatedPages)/customer-management/page.tsx
import { type Metadata } from "next";
import CustomerManagementClient from "./client";

export const metadata: Metadata = { title: "Customers" };

export default function CustomerManagementPage() {
	return <CustomerManagementClient />;
}
