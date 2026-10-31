"use client";

import React from "react";
import { Icon } from "@iconify/react";
import WebhookSettingsList from "@/components/List/WebhookSettingsList";

export default function OthersSettingsTab() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="mb-1 text-2xl font-medium">Webhooks</h2>
				<p className="text-muted-foreground text-sm">
					Send order events to your own systems as they happen.
				</p>
			</div>

			<div
				role="note"
				className="bg-muted/50 flex items-start gap-3 rounded-xl border p-4 text-sm"
			>
				<Icon icon="ph:shield-check" className="mt-0.5 size-5 shrink-0" />
				<p>
					Each request carries an{" "}
					<code className="font-mono text-xs">X-GoHive-Signature: t=…,v1=…</code> header.
					To check it, compute an HMAC-SHA256 of{" "}
					<code className="font-mono text-xs">&lt;t&gt;.&lt;raw body&gt;</code> with the
					endpoint&apos;s secret and compare it with{" "}
					<code className="font-mono text-xs">v1</code>. Failed deliveries are retried
					with backoff, and an endpoint that keeps failing is paused.
				</p>
			</div>

			<WebhookSettingsList />
		</div>
	);
}
