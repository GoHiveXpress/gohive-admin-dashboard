"use client";

/* eslint-disable react/no-array-index-key */

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";

export default function NotificationSettingsTab() {
	return (
		<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
			{/* Left: Add Notification */}
			<div className="border-border flex h-full flex-col rounded-[24px] border bg-white p-8 shadow-sm">
				<div className="mb-8 flex items-center gap-2">
					<Icon icon="ph:circle-fill" className="text-primary size-5" />
					<h3 className="text-foreground text-xl font-medium">Add Notification</h3>
				</div>

				<div className="flex-1 space-y-6">
					<div className="space-y-2">
						<label className="text-base font-medium">Title</label>
						<Input
							placeholder="e.g (system outage)"
							className="border-border h-14 rounded-xl bg-white"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-base font-medium">Message</label>
						<Textarea
							placeholder="Input text"
							className="border-border min-h-[200px] resize-none rounded-xl bg-white p-4"
						/>
					</div>
				</div>

				<Button className="bg-secondary hover:bg-secondary/90 mt-8 h-12 w-full rounded-lg text-base font-medium text-white">
					Add Template
				</Button>
			</div>

			{/* Right: Notifications List */}
			<div className="border-border h-full min-h-[500px] rounded-[24px] border bg-white p-8 shadow-sm">
				<div className="border-border mb-8 flex items-center gap-2 border-b pb-4">
					<Icon icon="ph:circle-fill" className="text-primary size-5" />
					<h3 className="text-foreground text-xl font-medium">Notifications</h3>
				</div>

				<div className="space-y-6">
					{["System Outage", "Heavy Rain Alert", "Rider Shortage"].map((item, i) => (
						<div
							key={i}
							className="group flex cursor-pointer items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<span className="bg-destructive size-1.5 rounded-full" />
								<span className="text-foreground text-lg font-medium">{item}</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground size-8"
							>
								<Icon icon="lucide:more-vertical" className="size-5" />
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
