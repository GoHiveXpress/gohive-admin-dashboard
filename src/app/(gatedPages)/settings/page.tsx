import { type Metadata } from "next";
import { Suspense } from "react";
import SettingsClient from "./client";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
	return (
		<Suspense fallback={<div>Loading Settings...</div>}>
			<SettingsClient />
		</Suspense>
	);
}
