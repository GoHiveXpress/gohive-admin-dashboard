"use client";

// "Send later" for the message composers, and the list of sends still waiting
// to go out. The backend's communication cron sends them when they're due.

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ConfirmActionModal from "@/components/_modals/ConfirmActionModal";
import { useCancelCommunication, useCommunications } from "@/hooks/communication";
import { MAX_SCHEDULE_DAYS, toLocalInput } from "@/lib/accountTools";
import { type CommunicationType, type ICommunication } from "@/types/communication";

const formatDate = (value: string) =>
	new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });

export function ScheduleField({
	enabled,
	onEnabledChange,
	value,
	onValueChange,
	error,
	idPrefix,
}: {
	enabled: boolean;
	onEnabledChange: (next: boolean) => void;
	value: string;
	onValueChange: (next: string) => void;
	error: string | null;
	idPrefix: string;
}) {
	const now = new Date();
	const latest = new Date(now.getTime() + MAX_SCHEDULE_DAYS * 24 * 60 * 60 * 1000);
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-3">
				<Switch
					id={`${idPrefix}-send-later`}
					checked={enabled}
					onCheckedChange={(checked) => {
						onEnabledChange(checked);
						// Start an hour out so the first pick is already valid
						if (checked && !value) {
							onValueChange(toLocalInput(new Date(now.getTime() + 60 * 60 * 1000)));
						}
					}}
				/>
				<label htmlFor={`${idPrefix}-send-later`} className="text-lg font-medium">
					Send later
				</label>
			</div>
			{enabled && (
				<div className="space-y-1">
					<Input
						type="datetime-local"
						aria-label="Send at"
						value={value}
						min={toLocalInput(now)}
						max={toLocalInput(latest)}
						onChange={(e) => onValueChange(e.target.value)}
						className={`h-12 max-w-xs bg-transparent ${error ? "border-destructive" : ""}`}
					/>
					{error ? (
						<p className="text-destructive text-sm">{error}</p>
					) : (
						<p className="text-muted-foreground text-xs">
							Your local time. You can cancel it until it goes out.
						</p>
					)}
				</div>
			)}
		</div>
	);
}

export function ScheduledSendsList({ type }: { type: CommunicationType }) {
	const { data } = useCommunications(type);
	const cancel = useCancelCommunication();
	const [cancelling, setCancelling] = useState<ICommunication | null>(null);
	const scheduled = (data?.data ?? [])
		.filter((c) => c.status === "scheduled" && c.scheduledAt)
		.sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""));

	if (scheduled.length === 0) return null;

	return (
		<div className="bg-card border-border rounded-xl border p-6 shadow-sm">
			<div className="mb-4 flex items-center gap-2">
				<Icon icon="ph:clock" className="size-5" />
				<h3 className="text-xl font-semibold">Scheduled</h3>
			</div>
			<ul className="divide-y">
				{scheduled.map((item) => (
					<li key={item._id} className="flex flex-wrap items-center gap-3 py-3">
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium">{item.subject}</p>
							<p className="text-muted-foreground text-xs capitalize">
								{formatDate(item.scheduledAt ?? "")} ·{" "}
								{item.targetAudience.join(", ")}
							</p>
						</div>
						<Button
							size="sm"
							variant="outline"
							disabled={cancel.isPending}
							onClick={() => setCancelling(item)}
						>
							Cancel
						</Button>
					</li>
				))}
			</ul>

			<ConfirmActionModal
				isOpen={cancelling !== null}
				onOpenChange={(open) => !open && setCancelling(null)}
				title="Cancel this scheduled send?"
				description={`"${cancelling?.subject ?? ""}" won't go out. It's kept as a draft.`}
				confirmLabel="Cancel send"
				tone="danger"
				isLoading={cancel.isPending}
				onConfirm={() => {
					if (!cancelling) return;
					cancel
						.mutateAsync(cancelling._id)
						.then(() => setCancelling(null))
						.catch(() => undefined);
				}}
			/>
		</div>
	);
}
