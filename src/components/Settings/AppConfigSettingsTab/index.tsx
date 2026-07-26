"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFeeConfig, useUpdateFeeConfig } from "@/hooks/integrationSettings";
import { useToast } from "@/hooks/useToast";

type FeeFormState = {
	serviceFeePercent: string;
	deliveryBaseFee: string;
	baseDistanceKm: string;
	extraBlockDistanceKm: string;
	extraBlockFee: string;
	maxDistanceKm: string;
};

const EMPTY_FORM: FeeFormState = {
	serviceFeePercent: "",
	deliveryBaseFee: "",
	baseDistanceKm: "",
	extraBlockDistanceKm: "",
	extraBlockFee: "",
	maxDistanceKm: "",
};

export default function AppConfigSettingsTab() {
	const { data, isLoading, isError } = useFeeConfig();
	const updateFeeConfigMutation = useUpdateFeeConfig();
	const toast = useToast();
	const [form, setForm] = useState<FeeFormState>(EMPTY_FORM);

	const feeConfig = data?.data;

	useEffect(() => {
		if (!feeConfig) return;

		setForm({
			serviceFeePercent: String(feeConfig.serviceFeePercent),
			deliveryBaseFee: String(feeConfig.deliveryBaseFee),
			baseDistanceKm: String(feeConfig.baseDistanceKm),
			extraBlockDistanceKm: String(feeConfig.extraBlockDistanceKm),
			extraBlockFee: String(feeConfig.extraBlockFee),
			maxDistanceKm: String(feeConfig.maxDistanceKm),
		});
	}, [feeConfig]);

	const formChanged = useMemo(() => {
		if (!feeConfig) return false;
		return (
			form.serviceFeePercent !== String(feeConfig.serviceFeePercent) ||
			form.deliveryBaseFee !== String(feeConfig.deliveryBaseFee) ||
			form.baseDistanceKm !== String(feeConfig.baseDistanceKm) ||
			form.extraBlockDistanceKm !== String(feeConfig.extraBlockDistanceKm) ||
			form.extraBlockFee !== String(feeConfig.extraBlockFee) ||
			form.maxDistanceKm !== String(feeConfig.maxDistanceKm)
		);
	}, [feeConfig, form]);

	const setField = (key: keyof FeeFormState, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const parseField = (value: string, label: string) => {
		const parsed = Number(value);
		if (!Number.isFinite(parsed)) {
			toast.error(`${label} must be a valid number`);
			return null;
		}
		return parsed;
	};

	const handleSave = async () => {
		const serviceFeePercent = parseField(form.serviceFeePercent, "Service fee %");
		const deliveryBaseFee = parseField(form.deliveryBaseFee, "Base delivery fee");
		const baseDistanceKm = parseField(form.baseDistanceKm, "Base distance");
		const extraBlockDistanceKm = parseField(
			form.extraBlockDistanceKm,
			"Extra block distance",
		);
		const extraBlockFee = parseField(form.extraBlockFee, "Extra block fee");
		const maxDistanceKm = parseField(form.maxDistanceKm, "Max distance");

		if (
			serviceFeePercent === null ||
			deliveryBaseFee === null ||
			baseDistanceKm === null ||
			extraBlockDistanceKm === null ||
			extraBlockFee === null ||
			maxDistanceKm === null
		) {
			return;
		}

		if (maxDistanceKm < baseDistanceKm) {
			toast.error("Max distance cannot be less than base distance");
			return;
		}

		await updateFeeConfigMutation.mutateAsync({
			serviceFeePercent,
			deliveryBaseFee,
			baseDistanceKm,
			extraBlockDistanceKm,
			extraBlockFee,
			maxDistanceKm,
		});
	};

	return (
		<div className="border-border rounded-[24px] border bg-white p-8 shadow-sm">
			<div className="mb-8 flex items-center justify-between">
				<h3 className="text-foreground/80 text-xl font-medium">Delivery and Service Fees</h3>
				{/* Using a relative container for the avatar to match screenshot position roughly */}
				<div className="relative">
					<div className="size-12 overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-sm">
						<img
							src="https://i.pravatar.cc/150?u=1"
							alt="Profile"
							className="size-full object-cover"
						/>
					</div>
				</div>
			</div>

			{isError && (
				<div className="text-destructive mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm">
					Failed to load fee configuration.
				</div>
			)}

			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Base delivery fee (NGN)</label>
					<Input
						value={form.deliveryBaseFee}
						onChange={(e) => setField("deliveryBaseFee", e.target.value)}
						disabled={isLoading || updateFeeConfigMutation.isPending}
						className="border-border h-12 rounded-xl bg-white"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Service fee (%)</label>
					<div className="relative">
						<Input
							value={form.serviceFeePercent}
							onChange={(e) => setField("serviceFeePercent", e.target.value)}
							disabled={isLoading || updateFeeConfigMutation.isPending}
							className="border-border h-12 rounded-xl bg-white pr-8"
						/>
						<span className="text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 text-sm">
							%
						</span>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Base distance (km)</label>
					<Input
						value={form.baseDistanceKm}
						onChange={(e) => setField("baseDistanceKm", e.target.value)}
						disabled={isLoading || updateFeeConfigMutation.isPending}
						className="border-border h-12 rounded-xl bg-white"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Extra block distance (km)</label>
					<Input
						value={form.extraBlockDistanceKm}
						onChange={(e) => setField("extraBlockDistanceKm", e.target.value)}
						disabled={isLoading || updateFeeConfigMutation.isPending}
						className="border-border h-12 rounded-xl bg-white"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Extra block fee (NGN)</label>
					<Input
						value={form.extraBlockFee}
						onChange={(e) => setField("extraBlockFee", e.target.value)}
						disabled={isLoading || updateFeeConfigMutation.isPending}
						className="border-border h-12 rounded-xl bg-white"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-muted-foreground text-sm">Max billable distance (km)</label>
					<Input
						value={form.maxDistanceKm}
						onChange={(e) => setField("maxDistanceKm", e.target.value)}
						disabled={isLoading || updateFeeConfigMutation.isPending}
						className="border-border h-12 rounded-xl bg-white"
					/>
				</div>
			</div>

			<div className="text-muted-foreground mt-4 text-xs">
				Distance pricing uses: base fee for base distance, then extra block fee per extra block distance.
			</div>

			<div className="mt-10 flex justify-center">
				<Button
					onClick={handleSave}
					disabled={
						isLoading ||
						updateFeeConfigMutation.isPending ||
						!formChanged
					}
					className="bg-secondary hover:bg-secondary/90 h-12 w-full max-w-md rounded-lg text-base font-medium text-white"
				>
					{updateFeeConfigMutation.isPending ? "Saving..." : "Apply Changes"}
				</Button>
			</div>
		</div>
	);
}

/* eslint-enable */
