"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
	REPORT_PRESETS,
	REPORT_PRESET_LABELS,
	type ReportPeriod,
	type ReportPreset,
	canCompare,
	compareLabel,
	periodError,
} from "@/lib/reportPeriod";

interface ReportPeriodPickerProps {
	value: ReportPeriod;
	onChange: (period: ReportPeriod) => void;
}

/** One period for a whole report page, with an optional comparison to the period before it. */
export default function ReportPeriodPicker({ value, onChange }: ReportPeriodPickerProps) {
	const error = periodError(value);
	const previous = value.compare ? compareLabel(value) : null;
	const update = (patch: Partial<ReportPeriod>) => onChange({ ...value, ...patch });

	return (
		<div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4">
			<div className="flex flex-wrap items-end gap-4">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="report-period">Period</Label>
					<Select
						value={value.preset}
						onValueChange={(preset) => update({ preset: preset as ReportPreset })}
					>
						<SelectTrigger id="report-period" className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{REPORT_PRESETS.map((preset) => (
								<SelectItem key={preset} value={preset}>
									{REPORT_PRESET_LABELS[preset]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{value.preset === "custom" && (
					<>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="report-from">From</Label>
							<Input
								id="report-from"
								type="date"
								value={value.from}
								max={value.to || undefined}
								onChange={(e) => update({ from: e.target.value })}
								className="w-[160px]"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="report-to">To</Label>
							<Input
								id="report-to"
								type="date"
								value={value.to}
								min={value.from || undefined}
								onChange={(e) => update({ to: e.target.value })}
								className="w-[160px]"
							/>
						</div>
					</>
				)}

				<div className="flex h-10 items-center gap-2">
					<Checkbox
						id="report-compare"
						checked={value.compare && canCompare(value)}
						disabled={!canCompare(value)}
						onCheckedChange={(checked) => update({ compare: checked === true })}
					/>
					<Label htmlFor="report-compare" className="font-normal">
						Compare with previous period
					</Label>
				</div>
			</div>

			{error ? (
				<p className="text-destructive text-sm">{error}</p>
			) : (
				<p className="text-muted-foreground text-sm">
					{!canCompare(value) && "All time can't be compared with an earlier period."}
					{previous && `Changes are shown against ${previous}.`}
				</p>
			)}
		</div>
	);
}
