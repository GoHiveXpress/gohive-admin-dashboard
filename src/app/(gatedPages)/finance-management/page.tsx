// src/app/(gatedPages)/finance-management/page.tsx
import { type Metadata } from "next";
import FinanceManagementClient from "./client";

export const metadata: Metadata = { title: "Finance" };

export default function FinanceManagementPage() {
	return <FinanceManagementClient />;
}
