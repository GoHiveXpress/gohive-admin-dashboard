import { Suspense } from "react";
import SettingsClient from "./client";

export default function SettingsPage() {
	return (
		<Suspense fallback={<div>Loading Settings...</div>}>
			<SettingsClient />
		</Suspense>
	);
}
