"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	useDeliverySurges,
	useEndDeliverySurge,
	useStartDeliverySurge,
} from "@/hooks/financeManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";
import { surgeLabel, surgeUntil } from "@/lib/moneyTools";
import { type DeliverySurge } from "@/types/financeManagement";

const MULTIPLIERS = ["1.25", "1.5", "1.75", "2", "2.5", "3"];
const DURATIONS = [
	{ value: "1", label: "1 hour" },
	{ value: "2", label: "2 hours" },
	{ value: "4", label: "4 hours" },
	{ value: "12", label: "12 hours" },
	{ value: "none", label: "Until I end it" },
];

function StartSurgeForm() {
	const [state, setState] = useState("");
	const [multiplier, setMultiplier] = useState("1.5");
	const [hours, setHours] = useState("2");
	const [reason, setReason] = useState("");
	const { mutate: start, isPending } = useStartDeliverySurge();
	const canSubmit = reason.trim().length >= 3 && !isPending;

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!canSubmit) return;
		start(
			{
				state: state.trim() || undefined,
				multiplier: Number(multiplier),
				reason: reason.trim(),
				hours: hours === "none" ? undefined : Number(hours),
			},
			{
				onSuccess: (res) => {
					toast.success(res.message);
					setReason("");
				},
				onError: (err) => {
					toast.error(err.message || "Couldn't start the surge");
				},
			},
		);
	};

	return (
		<form onSubmit={submit} className="border-border mb-6 rounded-xl border p-4">
			<h3 className="font-medium">Start a surge</h3>
			<p className="text-muted-foreground mb-4 text-sm">
				Raises the delivery fee on new orders. Items and the service fee don&apos;t change.
				Where surges overlap, the highest one applies.
			</p>
			<div className="flex flex-wrap items-end gap-3">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="surge-state">State</Label>
					<Input
						id="surge-state"
						value={state}
						onChange={(e) => setState(e.target.value)}
						placeholder="Empty = everywhere"
						className="w-[170px]"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="surge-multiplier">Delivery fee</Label>
					<Select value={multiplier} onValueChange={setMultiplier}>
						<SelectTrigger id="surge-multiplier" className="w-[110px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MULTIPLIERS.map((value) => (
								<SelectItem key={value} value={value}>
									{value}x
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="surge-hours">For</Label>
					<Select value={hours} onValueChange={setHours}>
						<SelectTrigger id="surge-hours" className="w-[150px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{DURATIONS.map((duration) => (
								<SelectItem key={duration.value} value={duration.value}>
									{duration.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
					<Label htmlFor="surge-reason">Reason</Label>
					<Input
						id="surge-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="e.g. Heavy rain, few riders online"
					/>
				</div>
				<Button type="submit" disabled={!canSubmit}>
					{isPending ? "Starting..." : "Start surge"}
				</Button>
			</div>
		</form>
	);
}

function EndSurgeDialog({ surge, onClose }: { surge: DeliverySurge | null; onClose: () => void }) {
	const { mutate: end, isPending } = useEndDeliverySurge();
	if (!surge) return null;

	const submit = () =>
		end(surge._id, {
			onSuccess: (res) => {
				toast.success(res.message);
				onClose();
			},
			onError: (err) => {
				toast.error(err.message || "Couldn't end the surge");
			},
		});

	return (
		<Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>End the {surgeLabel(surge)} surge?</DialogTitle>
					<DialogDescription>
						New orders go back to normal delivery fees. Orders already placed keep the
						fee they were charged.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isPending}>
						Cancel
					</Button>
					<Button onClick={submit} disabled={isPending}>
						{isPending ? "Ending..." : "End surge"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function SurgeRow({ surge, onEnd }: { surge: DeliverySurge; onEnd?: () => void }) {
	return (
		<div className="border-border flex flex-wrap items-center justify-between gap-3 border-b py-3 last:border-b-0">
			<div>
				<div className="flex items-center gap-2">
					<span className="font-semibold">{surgeLabel(surge)}</span>
					{onEnd && (
						<Badge
							variant="outline"
							className="border-amber-500/30 bg-amber-500/10 text-amber-700"
						>
							Live {surgeUntil(surge)}
						</Badge>
					)}
				</div>
				<p className="text-muted-foreground text-sm">
					{surge.reason} · started by {surge.createdByName ?? "an admin"}{" "}
					{new Date(surge.startsAt).toLocaleString()}
					{surge.endedAt && ` · ended ${new Date(surge.endedAt).toLocaleString()}`}
					{!surge.endedAt &&
						!onEnd &&
						surge.endsAt &&
						` · ran out ${new Date(surge.endsAt).toLocaleString()}`}
				</p>
			</div>
			{onEnd && (
				<Button size="sm" variant="outline" onClick={onEnd}>
					End now
				</Button>
			)}
		</div>
	);
}

export default function DeliverySurgeTab() {
	const { data, isLoading, isError } = useDeliverySurges();
	const { allows } = usePermissions();
	const canManage = allows(ACTION_RULES.manageMoney);
	const [ending, setEnding] = useState<DeliverySurge | null>(null);
	const live = data?.data.live ?? [];
	const past = data?.data.past ?? [];

	let liveContent: React.ReactNode;
	if (isLoading) {
		liveContent = <p className="text-muted-foreground text-sm">Loading surges...</p>;
	} else if (isError) {
		liveContent = <p className="text-sm text-red-700">Couldn&apos;t load surges.</p>;
	} else if (live.length === 0) {
		liveContent = (
			<p className="text-muted-foreground flex items-center gap-2 text-sm">
				<Icon icon="lucide:check-circle-2" className="size-4" />
				No surge on. Normal delivery fees apply everywhere.
			</p>
		);
	} else {
		liveContent = live.map((surge) => (
			<SurgeRow
				key={surge._id}
				surge={surge}
				onEnd={canManage ? () => setEnding(surge) : undefined}
			/>
		));
	}

	return (
		<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6">
				<h2 className="text-xl font-medium">Delivery Surge</h2>
				<p className="text-muted-foreground text-sm">
					Temporarily raise delivery fees when demand outruns riders. Base fees per state
					are set in Settings.
				</p>
			</div>

			{canManage && <StartSurgeForm />}

			<h3 className="mb-2 font-medium">Live now</h3>
			<div className="mb-6">{liveContent}</div>

			{past.length > 0 && (
				<>
					<h3 className="mb-2 font-medium">Recent</h3>
					<div>
						{past.map((surge) => (
							<SurgeRow key={surge._id} surge={surge} />
						))}
					</div>
				</>
			)}

			<EndSurgeDialog surge={ending} onClose={() => setEnding(null)} />
		</div>
	);
}
