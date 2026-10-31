// src/components/Vendor/VendorDetails/StoreControls/index.tsx
// Admin controls for a vendor's store: close it for a while, set its opening
// hours, and set GoHive's commission on its orders.

"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ConfirmActionModal from "@/components/_modals/ConfirmActionModal";
import {
	useCloseVendor,
	useReopenVendor,
	useUpdateVendorCommission,
	useUpdateVendorHours,
} from "@/hooks/useAccountTools";
import { usePermissions } from "@/hooks/usePermissions";
import {
	MAX_CLOSURE_HOURS,
	MAX_COMMISSION_PERCENT,
	closureError,
	closureLabel,
	fullWeek,
	hoursError,
	isClosedNow,
	parseCommission,
	to12Hour,
	to24Hour,
} from "@/lib/accountTools";
import { ACTION_RULES } from "@/lib/permissions";
import { type OperatingHours, type VendorUser } from "@/types/vendorManagement";

const Section = ({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) => (
	<section className="border-border/50 space-y-4 rounded-[20px] border bg-white p-6 shadow-sm">
		<div>
			<h3 className="text-foreground text-lg font-semibold">{title}</h3>
			<p className="text-muted-foreground text-sm">{description}</p>
		</div>
		{children}
	</section>
);

function ClosureSection({ vendor, canEdit }: { vendor: VendorUser; canEdit: boolean }) {
	const closure = vendor.vendorProfile.adminClosure;
	const closed = isClosedNow(closure);
	const closeStore = useCloseVendor(vendor._id);
	const reopen = useReopenVendor(vendor._id);
	const [reason, setReason] = useState("");
	const [hours, setHours] = useState("");
	const [touched, setTouched] = useState(false);
	const [confirmReopen, setConfirmReopen] = useState(false);
	const error = closureError(reason, hours);

	const submit = () => {
		setTouched(true);
		if (error) return;
		closeStore
			.mutateAsync({
				reason: reason.trim(),
				...(hours.trim() ? { hours: Number(hours) } : {}),
			})
			.then(() => {
				setReason("");
				setHours("");
				setTouched(false);
			})
			.catch(() => undefined);
	};

	return (
		<Section
			title="Close the store"
			description="Takes the store offline for customers straight away. The vendor can't go back online until it reopens."
		>
			{closed && closure ? (
				<div className="bg-destructive/5 border-destructive/20 flex flex-wrap items-start justify-between gap-4 rounded-xl border p-4">
					<div>
						<p className="text-destructive font-semibold">{closureLabel(closure)}</p>
						<p className="text-muted-foreground mt-1 text-sm">
							Reason: {closure.reason}
						</p>
					</div>
					{canEdit && (
						<Button variant="outline" onClick={() => setConfirmReopen(true)}>
							Reopen now
						</Button>
					)}
				</div>
			) : (
				canEdit && (
					<div className="grid gap-4 md:grid-cols-[1fr_200px]">
						<div className="space-y-2">
							<Label htmlFor="closure-reason">Reason (the vendor sees this)</Label>
							<Textarea
								id="closure-reason"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								maxLength={500}
								rows={2}
								placeholder="e.g. Hygiene inspection after customer complaints"
								className="resize-none rounded-xl"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="closure-hours">For how many hours</Label>
							<Input
								id="closure-hours"
								type="number"
								min={1}
								max={MAX_CLOSURE_HOURS}
								step={1}
								value={hours}
								onChange={(e) => setHours(e.target.value)}
								placeholder="Until reopened"
							/>
						</div>
						<div className="flex items-center justify-between gap-4 md:col-span-2">
							<span className="text-destructive text-xs">
								{touched ? error : null}
							</span>
							<Button
								variant="destructive"
								onClick={submit}
								disabled={closeStore.isPending}
							>
								{closeStore.isPending ? "Closing…" : "Close store"}
							</Button>
						</div>
					</div>
				)
			)}
			{!closed && !canEdit && (
				<p className="text-sm">The store isn&apos;t closed by GoHive.</p>
			)}

			<ConfirmActionModal
				isOpen={confirmReopen}
				onOpenChange={setConfirmReopen}
				title="Reopen the store?"
				description="The vendor can go online and take orders again. They're told it has reopened."
				confirmLabel="Reopen"
				isLoading={reopen.isPending}
				onConfirm={() => {
					reopen
						.mutateAsync(undefined)
						.then(() => setConfirmReopen(false))
						.catch(() => undefined);
				}}
			/>
		</Section>
	);
}

function HoursSection({ vendor, canEdit }: { vendor: VendorUser; canEdit: boolean }) {
	const saveHours = useUpdateVendorHours(vendor._id);
	const [week, setWeek] = useState<OperatingHours[]>(() =>
		fullWeek(vendor.vendorProfile.operatingHours),
	);
	useEffect(() => {
		setWeek(fullWeek(vendor.vendorProfile.operatingHours));
	}, [vendor.vendorProfile.operatingHours]);
	const error = hoursError(week);

	const setDay = (index: number, change: Partial<OperatingHours>) =>
		setWeek((days) => days.map((day, i) => (i === index ? { ...day, ...change } : day)));

	return (
		<Section
			title="Opening hours"
			description="When customers can order. Changes apply straight away and the vendor is told."
		>
			<div className="divide-border divide-y">
				{week.map((day, index) => (
					<div key={day.day} className="flex flex-wrap items-center gap-4 py-3">
						<span className="w-28 font-medium">{day.day}</span>
						<label className="flex items-center gap-2 text-sm">
							<Switch
								checked={day.isOpen}
								disabled={!canEdit}
								onCheckedChange={(isOpen) => setDay(index, { isOpen })}
								aria-label={`${day.day} open`}
							/>
							{day.isOpen ? "Open" : "Closed"}
						</label>
						{day.isOpen && (
							<label className="flex items-center gap-2 text-sm">
								<Switch
									checked={day.is24Hours}
									disabled={!canEdit}
									onCheckedChange={(is24Hours) => setDay(index, { is24Hours })}
									aria-label={`${day.day} open 24 hours`}
								/>
								24 hours
							</label>
						)}
						{day.isOpen && !day.is24Hours && (
							<div className="flex items-center gap-2 text-sm">
								<Input
									type="time"
									className="h-9 w-32"
									disabled={!canEdit}
									value={to24Hour(day.openTime)}
									onChange={(e) =>
										setDay(index, { openTime: to12Hour(e.target.value) })
									}
									aria-label={`${day.day} opens at`}
								/>
								<span className="text-muted-foreground">to</span>
								<Input
									type="time"
									className="h-9 w-32"
									disabled={!canEdit}
									value={to24Hour(day.closeTime)}
									onChange={(e) =>
										setDay(index, { closeTime: to12Hour(e.target.value) })
									}
									aria-label={`${day.day} closes at`}
								/>
							</div>
						)}
					</div>
				))}
			</div>
			{canEdit && (
				<div className="flex items-center justify-between gap-4">
					<span className="text-destructive text-xs">{error}</span>
					<Button
						onClick={() => saveHours.mutate(week)}
						disabled={!!error || saveHours.isPending}
					>
						{saveHours.isPending ? "Saving…" : "Save hours"}
					</Button>
				</div>
			)}
		</Section>
	);
}

function CommissionSection({ vendor }: { vendor: VendorUser }) {
	const current = vendor.vendorProfile.commissionPercent ?? 0;
	const save = useUpdateVendorCommission(vendor._id);
	const [value, setValue] = useState(String(current));
	useEffect(() => setValue(String(current)), [current]);
	const parsed = parseCommission(value);
	const error = "error" in parsed ? parsed.error : null;
	const unchanged = "percent" in parsed && parsed.percent === current;

	return (
		<Section
			title="Commission"
			description="GoHive's cut of the food total on this vendor's new orders. Orders already placed keep the rate they were placed at. 0% means no commission."
		>
			<div className="flex flex-wrap items-end gap-4">
				<div className="space-y-2">
					<Label htmlFor="commission">Commission (%)</Label>
					<Input
						id="commission"
						type="number"
						min={0}
						max={MAX_COMMISSION_PERCENT}
						step={0.5}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className="w-40"
					/>
				</div>
				<Button
					onClick={() => "percent" in parsed && save.mutate(parsed.percent)}
					disabled={!!error || unchanged || save.isPending}
				>
					{save.isPending ? "Saving…" : "Save commission"}
				</Button>
			</div>
			<p className="text-xs">
				{error ? (
					<span className="text-destructive">{error}</span>
				) : (
					<span className="text-muted-foreground">
						On a ₦10,000 order the vendor gets ₦
						{(
							10000 -
							("percent" in parsed ? parsed.percent : 0) * 100
						).toLocaleString()}
						.
					</span>
				)}
			</p>
		</Section>
	);
}

export default function StoreControlsTab({ vendor }: { vendor: VendorUser }) {
	const { allows } = usePermissions();
	const canEdit = allows(ACTION_RULES.manageVendorStore);
	const canSetCommission = allows(ACTION_RULES.manageMoney);

	return (
		<div className="space-y-6">
			{!canEdit && (
				<p className="text-muted-foreground flex items-center gap-2 text-sm">
					<Icon icon="ph:lock-simple" />
					You can view these settings. Changing them needs vendor edit access.
				</p>
			)}
			<ClosureSection vendor={vendor} canEdit={canEdit} />
			<HoursSection vendor={vendor} canEdit={canEdit} />
			{canSetCommission && <CommissionSection vendor={vendor} />}
		</div>
	);
}
