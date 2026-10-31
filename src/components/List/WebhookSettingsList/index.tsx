// src/components/List/WebhookSettingsList/index.tsx
// Webhook endpoints that receive signed order events, with their delivery log.

"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmActionModal from "@/components/_modals/ConfirmActionModal";
import {
	useCreateWebhook,
	useDeleteWebhook,
	useRotateWebhookSecret,
	useTestWebhook,
	useUpdateWebhook,
	useWebhookDeliveries,
	useWebhookEvents,
	useWebhooks,
} from "@/hooks/integrationSettings";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { type WebhookItem } from "@/types/integrationSettings";

const formatDate = (value?: string | null) =>
	value
		? new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
		: "Never";

function EventPicker({
	selected,
	onChange,
}: {
	selected: string[];
	onChange: (events: string[]) => void;
}) {
	const { data } = useWebhookEvents();
	const events = data?.data ?? [];
	const toggle = (event: string, checked: boolean) =>
		onChange(checked ? [...selected, event] : selected.filter((e) => e !== event));

	return (
		<fieldset className="space-y-2">
			<legend className="text-sm font-medium">Events</legend>
			<p className="text-muted-foreground text-xs">
				Leave all unticked to get every event, including ones added later.
			</p>
			<div className="grid grid-cols-2 gap-2">
				{events.map((event) => (
					<label key={event} className="flex items-center gap-2 font-mono text-xs">
						<Checkbox
							checked={selected.includes(event)}
							onCheckedChange={(checked) => toggle(event, checked === true)}
						/>
						{event}
					</label>
				))}
			</div>
		</fieldset>
	);
}

function SecretDialog({ secret, onClose }: { secret: string | null; onClose: () => void }) {
	const toast = useToast();
	return (
		<Dialog open={secret !== null} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[520px]">
				<DialogHeader>
					<DialogTitle>Copy the signing secret</DialogTitle>
					<DialogDescription>
						This is the only time it&apos;s shown. Use it to check the{" "}
						<code className="font-mono text-xs">X-GoHive-Signature</code> header on each
						request. If you lose it, rotate it.
					</DialogDescription>
				</DialogHeader>
				<div className="bg-muted flex items-center gap-2 rounded-lg p-3">
					<code className="flex-1 break-all font-mono text-xs">{secret}</code>
					<Button
						size="sm"
						variant="outline"
						onClick={() => {
							navigator.clipboard
								.writeText(secret ?? "")
								.then(() => toast.success("Copied"))
								.catch(() =>
									toast.error("Couldn't copy. Select it and copy by hand."),
								);
						}}
					>
						<Icon icon="ph:copy" className="mr-1 size-4" />
						Copy
					</Button>
				</div>
				<Button onClick={onClose}>I&apos;ve saved it</Button>
			</DialogContent>
		</Dialog>
	);
}

function WebhookFormDialog({
	open,
	webhook,
	onClose,
	onCreated,
}: {
	open: boolean;
	// Editing this one, or creating when null
	webhook: WebhookItem | null;
	onClose: () => void;
	onCreated: (secret: string) => void;
}) {
	const create = useCreateWebhook();
	const update = useUpdateWebhook();
	const [url, setUrl] = useState(webhook?.url ?? "");
	const [description, setDescription] = useState(webhook?.description ?? "");
	const [events, setEvents] = useState<string[]>(webhook?.events ?? []);
	const pending = create.isPending || update.isPending;
	let submitLabel = webhook ? "Save" : "Add webhook";
	if (pending) submitLabel = "Saving…";

	const submit = () => {
		const payload = { url: url.trim(), description: description.trim(), events };
		if (webhook) {
			update
				.mutateAsync({ id: webhook._id, payload })
				.then(onClose)
				.catch(() => undefined);
			return;
		}
		create
			.mutateAsync(payload)
			.then((res) => {
				onClose();
				onCreated(res.data.secret);
			})
			.catch(() => undefined);
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && !pending && onClose()}>
			<DialogContent className="sm:max-w-[560px]">
				<DialogHeader>
					<DialogTitle>{webhook ? "Edit webhook" : "Add a webhook"}</DialogTitle>
					<DialogDescription>
						GoHive sends a signed JSON POST to this URL when an order changes. It must
						be a public https address.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="webhook-url">URL</Label>
						<Input
							id="webhook-url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://example.com/gohive/webhook"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="webhook-description">Description</Label>
						<Input
							id="webhook-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="e.g. Accounting system"
						/>
					</div>
					<EventPicker selected={events} onChange={setEvents} />
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onClose} disabled={pending}>
						Cancel
					</Button>
					<Button onClick={submit} disabled={!url.trim() || pending}>
						{submitLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

const DELIVERY_STYLES = {
	delivered: "bg-green-50 text-green-700",
	pending: "bg-amber-50 text-amber-700",
	failed: "bg-destructive/10 text-destructive",
} as const;

function DeliveriesDialog({
	webhook,
	onClose,
}: {
	webhook: WebhookItem | null;
	onClose: () => void;
}) {
	const [page, setPage] = useState(1);
	const { data, isLoading, isFetching } = useWebhookDeliveries(webhook?._id ?? null, page);
	const deliveries = data?.data ?? [];
	const pages = data?.pagination.pages ?? 1;

	return (
		<Dialog
			open={webhook !== null}
			onOpenChange={(open) => {
				if (!open) {
					setPage(1);
					onClose();
				}
			}}
		>
			<DialogContent className="sm:max-w-[760px]">
				<DialogHeader>
					<DialogTitle>Deliveries</DialogTitle>
					<DialogDescription className="break-all">{webhook?.url}</DialogDescription>
				</DialogHeader>
				{isLoading && <Skeleton className="h-48 w-full" />}
				{!isLoading && deliveries.length === 0 && (
					<p className="text-muted-foreground py-8 text-center text-sm">
						Nothing sent yet. Use Send test to try it.
					</p>
				)}
				{deliveries.length > 0 && (
					<div className={cn("max-h-[60vh] overflow-auto", isFetching && "opacity-60")}>
						<table className="w-full text-sm">
							<thead>
								<tr className="text-muted-foreground border-b text-left text-xs uppercase">
									<th className="py-2 pr-3 font-medium">Event</th>
									<th className="py-2 pr-3 font-medium">Status</th>
									<th className="py-2 pr-3 font-medium">Tries</th>
									<th className="py-2 pr-3 font-medium">Response</th>
									<th className="py-2 font-medium">When</th>
								</tr>
							</thead>
							<tbody>
								{deliveries.map((d) => (
									<tr key={d._id} className="border-b align-top last:border-0">
										<td className="py-2 pr-3 font-mono text-xs">{d.event}</td>
										<td className="py-2 pr-3">
											<Badge
												className={cn(
													"rounded-full border-none capitalize shadow-none",
													DELIVERY_STYLES[d.status],
												)}
											>
												{d.status}
											</Badge>
										</td>
										<td className="py-2 pr-3">{d.attempts}</td>
										<td className="py-2 pr-3 text-xs">
											{d.responseStatus ? `HTTP ${d.responseStatus}` : "—"}
											{d.lastError && (
												<span className="text-destructive block">
													{d.lastError}
												</span>
											)}
											{d.status === "pending" && d.nextAttemptAt && (
												<span className="text-muted-foreground block">
													Retrying {formatDate(d.nextAttemptAt)}
												</span>
											)}
										</td>
										<td className="text-muted-foreground whitespace-nowrap py-2 text-xs">
											{formatDate(d.createdAt)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{pages > 1 && (
					<div className="flex items-center justify-end gap-2">
						<span className="text-muted-foreground text-xs">
							Page {page} of {pages}
						</span>
						<Button
							size="sm"
							variant="outline"
							disabled={page <= 1}
							onClick={() => setPage((p) => p - 1)}
						>
							Previous
						</Button>
						<Button
							size="sm"
							variant="outline"
							disabled={page >= pages}
							onClick={() => setPage((p) => p + 1)}
						>
							Next
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default function WebhookSettingsList() {
	const { data, isLoading, error } = useWebhooks();
	const update = useUpdateWebhook();
	const remove = useDeleteWebhook();
	const rotate = useRotateWebhookSecret();
	const test = useTestWebhook();

	const [form, setForm] = useState<{ open: boolean; webhook: WebhookItem | null }>({
		open: false,
		webhook: null,
	});
	const [secret, setSecret] = useState<string | null>(null);
	const [deliveriesFor, setDeliveriesFor] = useState<WebhookItem | null>(null);
	const [deleting, setDeleting] = useState<WebhookItem | null>(null);
	const [rotating, setRotating] = useState<WebhookItem | null>(null);

	const webhooks = data?.data ?? [];

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button onClick={() => setForm({ open: true, webhook: null })}>
					<Icon icon="ph:plus" className="mr-2 size-4" />
					Add webhook
				</Button>
			</div>

			{isLoading && <Skeleton className="h-32 w-full rounded-xl" />}
			{error && <p className="text-destructive text-sm">Failed to load webhooks.</p>}
			{!isLoading && !error && webhooks.length === 0 && (
				<p className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-sm">
					No webhooks yet.
				</p>
			)}

			{webhooks.map((hook) => {
				const active = hook.status === "Active";
				return (
					<div
						key={hook._id}
						className="border-border/60 space-y-3 rounded-xl border bg-white p-4 shadow-sm"
					>
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div className="min-w-0 space-y-1">
								<p className="break-all font-mono text-sm">{hook.url}</p>
								{hook.description && (
									<p className="text-muted-foreground text-sm">
										{hook.description}
									</p>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Badge
									className={cn(
										"rounded-full border-none shadow-none",
										active
											? "bg-green-50 text-green-700"
											: "bg-muted text-muted-foreground",
									)}
								>
									{active ? "Active" : "Paused"}
								</Badge>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											aria-label="Webhook actions"
										>
											<Icon
												icon="ph:dots-three-vertical-bold"
												className="size-5"
											/>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-52">
										<DropdownMenuItem
											disabled={test.isPending}
											onSelect={() => test.mutate(hook._id)}
										>
											<Icon
												icon="ph:paper-plane-tilt"
												className="mr-2 size-4"
											/>
											Send test
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => setDeliveriesFor(hook)}>
											<Icon icon="ph:list-checks" className="mr-2 size-4" />
											View deliveries
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() => setForm({ open: true, webhook: hook })}
										>
											<Icon icon="ph:pencil-simple" className="mr-2 size-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={update.isPending}
											onSelect={() =>
												update.mutate({
													id: hook._id,
													payload: {
														status: active ? "Inactive" : "Active",
													},
												})
											}
										>
											<Icon
												icon={active ? "ph:pause" : "ph:play"}
												className="mr-2 size-4"
											/>
											{active ? "Pause" : "Resume"}
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => setRotating(hook)}>
											<Icon
												icon="ph:arrows-clockwise"
												className="mr-2 size-4"
											/>
											Rotate secret
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive focus:text-destructive"
											onSelect={() => setDeleting(hook)}
										>
											<Icon icon="ph:trash" className="mr-2 size-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						{hook.disabledReason && (
							<p className="bg-destructive/5 text-destructive rounded-lg px-3 py-2 text-xs">
								Paused by GoHive: {hook.disabledReason} Fix the endpoint, then
								resume it.
							</p>
						)}

						<div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 text-xs">
							<span>
								Events:{" "}
								{hook.events.length ? (
									<span className="font-mono">{hook.events.join(", ")}</span>
								) : (
									"all"
								)}
							</span>
							<span>Last sent: {formatDate(hook.lastTriggeredAt)}</span>
							{hook.consecutiveFailures > 0 && (
								<span className="text-destructive">
									{hook.consecutiveFailures} failure
									{hook.consecutiveFailures === 1 ? "" : "s"} in a row
								</span>
							)}
						</div>
					</div>
				);
			})}

			{form.open && (
				<WebhookFormDialog
					open={form.open}
					webhook={form.webhook}
					onClose={() => setForm({ open: false, webhook: null })}
					onCreated={setSecret}
				/>
			)}
			<SecretDialog secret={secret} onClose={() => setSecret(null)} />
			<DeliveriesDialog webhook={deliveriesFor} onClose={() => setDeliveriesFor(null)} />

			<ConfirmActionModal
				isOpen={deleting !== null}
				onOpenChange={(open) => !open && setDeleting(null)}
				title="Delete this webhook?"
				description="GoHive stops sending to it straight away and its delivery log is deleted."
				confirmLabel="Delete"
				tone="danger"
				isLoading={remove.isPending}
				onConfirm={() => {
					if (!deleting) return;
					remove
						.mutateAsync(deleting._id)
						.then(() => setDeleting(null))
						.catch(() => undefined);
				}}
			/>

			<ConfirmActionModal
				isOpen={rotating !== null}
				onOpenChange={(open) => !open && setRotating(null)}
				title="Rotate the signing secret?"
				description="The old secret stops working at once, so requests fail signature checks until the receiver uses the new one."
				confirmLabel="Rotate"
				tone="danger"
				isLoading={rotate.isPending}
				onConfirm={() => {
					if (!rotating) return;
					rotate
						.mutateAsync(rotating._id)
						.then((res) => {
							setRotating(null);
							setSecret(res.data.secret);
						})
						.catch(() => undefined);
				}}
			/>
		</div>
	);
}
