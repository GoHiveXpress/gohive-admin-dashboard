"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { usePromoCodes, useSavePromoCode } from "@/hooks/financeManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";
import {
	EMPTY_PROMO_FORM,
	PROMO_STATE_LABELS,
	type PromoForm,
	type PromoState,
	promoFormError,
	promoPayload,
	promoState,
	promoToForm,
	promoValueLabel,
} from "@/lib/moneyTools";
import { type PromoCode, type PromoType } from "@/types/financeManagement";
import { cn } from "@/lib/utils";

const naira = (value: number) => `₦${value.toLocaleString()}`;

const STATE_STYLES: Record<PromoState, string> = {
	active: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
	scheduled: "bg-sky-500/10 text-sky-700 border-sky-500/30",
	expired: "bg-muted text-muted-foreground border-border",
	used_up: "bg-muted text-muted-foreground border-border",
	paused: "bg-amber-500/10 text-amber-700 border-amber-500/30",
};

const PROMO_TYPES: { value: PromoType; label: string }[] = [
	{ value: "percent", label: "Percent off items" },
	{ value: "fixed", label: "Naira off items" },
	{ value: "free_delivery", label: "Free delivery" },
];

function Field({
	id,
	label,
	hint,
	children,
}: {
	id: string;
	label: string;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label htmlFor={id}>{label}</Label>
			{children}
			{hint && <p className="text-muted-foreground text-xs">{hint}</p>}
		</div>
	);
}

function PromoDialog({ promo, onClose }: { promo: PromoCode | "new"; onClose: () => void }) {
	const isNew = promo === "new";
	const [form, setForm] = useState<PromoForm>(isNew ? EMPTY_PROMO_FORM : promoToForm(promo));
	const { mutate: save, isPending } = useSavePromoCode();
	const error = promoFormError(form, isNew);

	const set = <K extends keyof PromoForm>(key: K, value: PromoForm[K]) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		if (error) return;
		save(
			{ id: isNew ? undefined : promo._id, data: promoPayload(form, isNew) },
			{
				onSuccess: (res) => {
					toast.success(res.message);
					onClose();
				},
				onError: (err) => {
					toast.error(err.message || "Couldn't save the promo code");
				},
			},
		);
	};

	return (
		<Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
				<form onSubmit={submit} className="flex flex-col gap-4">
					<DialogHeader>
						<DialogTitle>{isNew ? "New promo code" : `Edit ${promo.code}`}</DialogTitle>
						<DialogDescription>
							GoHive pays for the discount. Vendors and riders are paid as if there
							was none.
						</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field
							id="promo-code"
							label="Code"
							hint={isNew ? undefined : "Codes can't be renamed."}
						>
							<Input
								id="promo-code"
								value={form.code}
								onChange={(e) => set("code", e.target.value.toUpperCase())}
								placeholder="WELCOME10"
								disabled={!isNew}
							/>
						</Field>
						<Field id="promo-type" label="Discount">
							<Select
								value={form.type}
								onValueChange={(value) => set("type", value as PromoType)}
								disabled={!isNew}
							>
								<SelectTrigger id="promo-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PROMO_TYPES.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
						{form.type !== "free_delivery" && (
							<Field
								id="promo-value"
								label={form.type === "percent" ? "Percent off" : "Naira off"}
							>
								<Input
									id="promo-value"
									inputMode="decimal"
									value={form.value}
									onChange={(e) => set("value", e.target.value)}
									placeholder={form.type === "percent" ? "10" : "500"}
								/>
							</Field>
						)}
						{form.type === "percent" && (
							<Field
								id="promo-max"
								label="Most it can take off (₦)"
								hint="Leave empty for no cap."
							>
								<Input
									id="promo-max"
									inputMode="decimal"
									value={form.maxDiscount}
									onChange={(e) => set("maxDiscount", e.target.value)}
								/>
							</Field>
						)}
						<Field id="promo-min" label="Minimum items total (₦)">
							<Input
								id="promo-min"
								inputMode="decimal"
								value={form.minSubtotal}
								onChange={(e) => set("minSubtotal", e.target.value)}
								placeholder="0"
							/>
						</Field>
						<Field
							id="promo-states"
							label="States"
							hint="Comma separated. Empty means everywhere."
						>
							<Input
								id="promo-states"
								value={form.states}
								onChange={(e) => set("states", e.target.value)}
								placeholder="Lagos, Abuja"
							/>
						</Field>
						<Field id="promo-starts" label="Starts">
							<Input
								id="promo-starts"
								type="datetime-local"
								value={form.startsAt}
								onChange={(e) => set("startsAt", e.target.value)}
							/>
						</Field>
						<Field id="promo-ends" label="Ends">
							<Input
								id="promo-ends"
								type="datetime-local"
								value={form.endsAt}
								onChange={(e) => set("endsAt", e.target.value)}
							/>
						</Field>
						<Field id="promo-limit" label="Total uses" hint="Empty means no limit.">
							<Input
								id="promo-limit"
								inputMode="numeric"
								value={form.usageLimit}
								onChange={(e) => set("usageLimit", e.target.value)}
							/>
						</Field>
						<Field
							id="promo-per-customer"
							label="Uses per customer"
							hint="Empty means no limit."
						>
							<Input
								id="promo-per-customer"
								inputMode="numeric"
								value={form.perCustomerLimit}
								onChange={(e) => set("perCustomerLimit", e.target.value)}
							/>
						</Field>
						<div className="sm:col-span-2">
							<Field id="promo-description" label="Internal note">
								<Input
									id="promo-description"
									value={form.description}
									onChange={(e) => set("description", e.target.value)}
									placeholder="e.g. Instagram campaign, March"
								/>
							</Field>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-6">
						<div className="flex items-center gap-2">
							<Checkbox
								id="promo-first-order"
								checked={form.firstOrderOnly}
								onCheckedChange={(checked) =>
									set("firstOrderOnly", checked === true)
								}
							/>
							<Label htmlFor="promo-first-order">First orders only</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id="promo-active"
								checked={form.active}
								onCheckedChange={(checked) => set("active", checked)}
							/>
							<Label htmlFor="promo-active">{form.active ? "Live" : "Paused"}</Label>
						</div>
					</div>

					{error && <p className="text-destructive text-sm">{error}</p>}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={!!error || isPending}>
							{isPending ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function PromoCodesTab() {
	const { data, isLoading, isError } = usePromoCodes();
	const { allows } = usePermissions();
	const canManage = allows(ACTION_RULES.manageMoney);
	const [editing, setEditing] = useState<PromoCode | "new" | null>(null);
	const promos = data?.data ?? [];

	let rows: React.ReactNode;
	if (isLoading) {
		rows = (
			<TableRow>
				<TableCell colSpan={7} className="text-muted-foreground h-20 text-center">
					Loading promo codes...
				</TableCell>
			</TableRow>
		);
	} else if (isError) {
		rows = (
			<TableRow>
				<TableCell colSpan={7} className="h-20 text-center text-red-700">
					Couldn&apos;t load promo codes.
				</TableCell>
			</TableRow>
		);
	} else if (promos.length === 0) {
		rows = (
			<TableRow>
				<TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
					No promo codes yet.
				</TableCell>
			</TableRow>
		);
	} else {
		rows = promos.map((promo) => {
			const state = promoState(promo);
			return (
				<TableRow key={promo._id}>
					<TableCell>
						<span className="font-mono font-semibold">{promo.code}</span>
						{promo.description && (
							<div className="text-muted-foreground text-xs">{promo.description}</div>
						)}
					</TableCell>
					<TableCell>
						{promoValueLabel(promo)}
						{!!promo.minSubtotal && (
							<div className="text-muted-foreground text-xs">
								on {naira(promo.minSubtotal)}+
							</div>
						)}
					</TableCell>
					<TableCell>
						<Badge variant="outline" className={cn(STATE_STYLES[state])}>
							{PROMO_STATE_LABELS[state]}
						</Badge>
					</TableCell>
					<TableCell>
						{promo.uses}
						{promo.usageLimit ? ` / ${promo.usageLimit}` : ""}
					</TableCell>
					<TableCell>{naira(promo.discountGiven)}</TableCell>
					<TableCell className="text-muted-foreground text-xs">
						{promo.states.length ? promo.states.join(", ") : "Everywhere"}
						{promo.firstOrderOnly && <div>First orders only</div>}
						{promo.endsAt && (
							<div>Ends {new Date(promo.endsAt).toLocaleDateString()}</div>
						)}
					</TableCell>
					<TableCell className="text-right">
						{canManage && (
							<Button size="sm" variant="ghost" onClick={() => setEditing(promo)}>
								Edit
							</Button>
						)}
					</TableCell>
				</TableRow>
			);
		});
	}

	return (
		<div className="border-border rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-xl font-medium">Promo Codes</h2>
					<p className="text-muted-foreground text-sm">
						Discounts customers enter at checkout. Uses and discount given count orders
						that went through.
					</p>
				</div>
				{canManage && (
					<Button onClick={() => setEditing("new")}>
						<Icon icon="lucide:plus" className="mr-1 size-4" />
						New promo code
					</Button>
				)}
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Code</TableHead>
							<TableHead>Discount</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Uses</TableHead>
							<TableHead>Given</TableHead>
							<TableHead>Rules</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>{rows}</TableBody>
				</Table>
			</div>

			{editing && (
				<PromoDialog
					key={editing === "new" ? "new" : editing._id}
					promo={editing}
					onClose={() => setEditing(null)}
				/>
			)}
		</div>
	);
}
