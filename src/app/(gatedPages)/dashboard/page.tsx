// src/app/(gatedPages)/dashboard/page.tsx
import { type Metadata } from "next";
import DashboardClient from "./client";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
	return <DashboardClient />;
}
