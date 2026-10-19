"use client";

import React from "react";
import { useFeeHistory } from "@/hooks/integrationSettings";
import { type FeeChange, type FeeField, type FeeStateOverride } from "@/types/integrationSettings";

const FIELD_LABELS: Record<FeeField, string> = {
	serviceFeePercent: "Service fee",
	deliveryBaseFee: "Base delivery fee",
	baseDistanceKm: "Base distance",
	extraBlockDistanceKm: "Extra block distance",
	extraBlockFee: "Extra block fee",
	maxDistanceKm: "Max delivery distance",
};

const formatValue = (field: FeeField, value: number | null) => {
	if (value === null) return "default";
	if (field === "serviceFeePercent") return `${value}%`;
	if (field.endsWith("Km")) return `${value} km`;
	return `₦${value.toLocaleString()}`;
};

const overrideSummary = (override: FeeStateOverride) =>
	(Object.keys(FIELD_LABELS) as FeeField[])
		.filter((field) => typeof override[field] === "number")
		.map((field) => `${FIELD_LABELS[field]} ${formatValue(field, override[field] ?? null)}`)
		.join(", ") || "no fee changes";

function describe(change: FeeChange) {
	const where = change.scope === "default" ? "" : `${change.scope}: `;
	if (change.field === "added") {
		return `${where}override added (${overrideSummary(change.to as FeeStateOverride)})`;
	}
	if (change.field === "removed") return `${where}override removed`;
	const { field } = change;
	return `${where}${FIELD_LABELS[field]} ${formatValue(field, change.from as number | null)} → ${formatValue(field, change.to as number | null)}`;
}

export default function FeeHistory() {
	const { data, isLoading, isError } = useFeeHistory();
	const entries = data?.data ?? [];

	let content: React.ReactNode;
	if (isLoading) {
		content = <p className="text-muted-foreground text-sm">Loading fee history...</p>;
	} else if (isError) {
		content = <p className="text-sm text-red-700">Couldn&apos;t load fee history.</p>;
	} else if (entries.length === 0) {
		content = (
			<p className="text-muted-foreground text-sm">
				No fee changes recorded yet. Changes are recorded from now on.
			</p>
		);
	} else {
		content = (
			<ol className="border-border space-y-4 border-l pl-5">
				{entries.map((entry) => (
					<li key={entry._id} className="relative">
						<span className="bg-secondary absolute left-[-25px] top-1.5 size-2.5 rounded-full" />
						<p className="text-sm font-medium">
							{entry.changedByName ?? "An admin"}
							<span className="text-muted-foreground font-normal">
								{" "}
								· {new Date(entry.createdAt).toLocaleString()}
							</span>
						</p>
						<ul className="text-muted-foreground mt-1 space-y-0.5 text-sm">
							{entry.changes.map((change) => (
								<li key={`${change.scope}-${change.field}`}>{describe(change)}</li>
							))}
						</ul>
					</li>
				))}
			</ol>
		);
	}

	return (
		<div className="border-border mt-10 border-t pt-8">
			<h3 className="mb-1 text-lg font-medium">Fee history</h3>
			<p className="text-muted-foreground mb-5 text-sm">
				Every change to fees, newest first, with who made it.
			</p>
			{content}
		</div>
	);
}
