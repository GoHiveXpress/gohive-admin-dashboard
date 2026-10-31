// src/app/(gatedPages)/vendor-management/[id]/page.tsx
import { type Metadata } from "next";
import VendorDetailsClient from "./client";

export const metadata: Metadata = { title: "Vendor" };

export default function VendorDetailsPage({ params }: { params: { id: string } }) {
	return <VendorDetailsClient id={params.id} />;
}
