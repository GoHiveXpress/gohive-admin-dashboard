"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import ApiKeysSettingsList from "@/components/List/ApiKeysSettingsList";
import WebhookSettingsList from "@/components/List/WebhookSettingsList";

// Nothing checks these keys or sends to these endpoints yet, so say so
const NotActiveBadge = () => (
	<span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-medium text-amber-800">
		Not active yet
	</span>
);

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
					<NotActiveBadge />
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
					<NotActiveBadge />
				</button>
			</div>

			<div>
				<h2 className="mb-4 text-2xl font-medium">
					{subTab === "api-keys" ? "Manage API Keys" : "Manage Webhooks"}
				</h2>

				<div
					role="note"
					className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
				>
					<Icon icon="ph:info-bold" className="mt-0.5 size-5 shrink-0" />
					<p>
						<span className="font-semibold">Not active yet.</span>{" "}
						{subTab === "api-keys"
							? "Keys created here are saved, but the API does not accept them yet."
							: "Endpoints added here are saved, but no events are sent to them yet."}
					</p>
				</div>

				{subTab === "api-keys" && <ApiKeysSettingsList />}
				{subTab === "webhooks" && <WebhookSettingsList />}
			</div>
		</div>
	);
}
