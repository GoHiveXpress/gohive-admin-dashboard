// src/app/(gatedPages)/report-analytics/page.tsx
import { type Metadata } from "next";
import ReportAnalyticsClient from "./client";

export const metadata: Metadata = { title: "Reports" };

export default function ReportAnalyticsPage() {
	return <ReportAnalyticsClient />;
}
