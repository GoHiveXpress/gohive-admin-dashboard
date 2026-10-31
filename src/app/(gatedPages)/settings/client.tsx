// src/app/(gatedPages)/settings/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import SettingsMain from "@/components/Settings";

export default function SettingsClient() {
	return (
		<RouteWrapper>
			<SettingsMain />
		</RouteWrapper>
	);
}
