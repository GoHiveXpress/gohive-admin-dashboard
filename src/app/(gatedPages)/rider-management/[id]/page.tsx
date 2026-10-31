// src/app/(gatedPages)/rider-management/[id]/page.tsx
import { type Metadata } from "next";
import RiderDetailsClient from "./client";

export const metadata: Metadata = { title: "Rider" };

export default function RiderDetailsPage({ params }: { params: { id: string } }) {
	return <RiderDetailsClient id={params.id} />;
}
