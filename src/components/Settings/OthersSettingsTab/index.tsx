"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ApiKeysSettingsList from "@/components/List/ApiKeysSettingsList";
import WebhookSettingsList from "@/components/List/WebhookSettingsList";

export default function OthersSettingsTab() {
	const [subTab, setSubTab] = useState<"api-keys" | "webhooks">("api-keys");

	return (
		<div className="space-y-6">
			{/* Sub Tabs */}
			<div className="flex items-center gap-8 border-b border-transparent">
				<button
					onClick={() => setSubTab("api-keys")}
					className={`pb-2 text-lg font-medium transition-all ${
						subTab === "api-keys"
							? "text-foreground border-secondary border-b-2"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					API Keys
				</button>
				<button
					onClick={() => setSubTab("webhooks")}
					className={`pb-2 text-lg font-medium transition-all ${
						subTab === "webhooks"
							? "text-foreground border-secondary border-b-2"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					Webhooks
				</button>
			</div>

			<div>
				<h2 className="mb-6 text-2xl font-medium">
					{subTab === "api-keys" ? "Manage API Keys" : "Manage Webhooks"}
				</h2>

				{subTab === "api-keys" && <ApiKeysSettingsList />}
				{subTab === "webhooks" && <WebhookSettingsList />}
			</div>
		</div>
	);
}

/* eslint-enable */
