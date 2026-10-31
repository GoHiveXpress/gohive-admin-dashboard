// src/app/(gatedPages)/customer-management/[id]/page.tsx
import { type Metadata } from "next";
import SingleCustomerProfile from "./client";

export const metadata: Metadata = { title: "Customer" };

export default function SingleCustomerProfilePage() {
	return <SingleCustomerProfile />;
}
