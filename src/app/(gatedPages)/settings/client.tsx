// src/app/(gatedPages)/settings/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import SettingsMain from "@/components/Settings";
import { Icon } from "@iconify/react";

export default function SettingsClient() {
	return (
		<RouteWrapper
			middleSlot={
				<div className="flex items-center gap-3">
					<Icon icon="lucide:settings" className="text-secondary size-8" />
					<h1 className="text-foreground text-2xl font-bold">Settings</h1>
				</div>
			}
		>
			<SettingsMain />
		</RouteWrapper>
	);
}
