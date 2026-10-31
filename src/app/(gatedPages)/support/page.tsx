// src/app/(gatedPages)/support/page.tsx
import { type Metadata } from "next";
import SupportClient from "./client";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
	return <SupportClient />;
}
