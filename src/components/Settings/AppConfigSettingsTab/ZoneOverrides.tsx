"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateFeeConfig } from "@/hooks/integrationSettings";
import {
	ZONE_FIELDS,
	type ZoneField,
	type ZoneRow,
	emptyZoneRow,
	zoneRowsToOverrides,
	zoneToRow,
} from "@/lib/moneyTools";
import { type FeeConfig } from "@/types/integrationSettings";

// Per-state fees. Empty fields use the national rate above.
export default function ZoneOverrides({ feeConfig }: { feeConfig?: FeeConfig }) {
	const [rows, setRows] = useState<ZoneRow[]>([]);
	const [error, setError] = useState<string | null>(null);
	const updateFeeConfig = useUpdateFeeConfig();

	useEffect(() => {
		setRows((feeConfig?.stateOverrides ?? []).map(zoneToRow));
	}, [feeConfig]);

	const saved = JSON.stringify((feeConfig?.stateOverrides ?? []).map(zoneToRow));
	const changed = JSON.stringify(rows) !== saved;

	const setCell = (index: number, key: "state" | ZoneField, value: string) => {
		setError(null);
		setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
	};

	const save = async () => {
		const result = zoneRowsToOverrides(rows);
		if ("error" in result) {
			setError(result.error);
			return;
		}
		await updateFeeConfig.mutateAsync({ stateOverrides: result.overrides });
	};

	return (
		<div className="border-border mt-10 border-t pt-8">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h4 className="text-foreground/80 text-lg font-medium">Fees by state</h4>
					<p className="text-muted-foreground text-sm">
						Orders are priced by the vendor&apos;s state. Leave a field empty to use the
						national rate above. Surges are started from Finance.
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setRows((prev) => [...prev, emptyZoneRow()])}
				>
					<Icon icon="lucide:plus" className="mr-1 size-4" />
					Add state
				</Button>
			</div>

			{rows.length === 0 ? (
				<p className="text-muted-foreground text-sm">Every state uses the national rate.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[760px] text-sm">
						<thead>
							<tr className="text-muted-foreground text-left text-xs">
								<th className="pb-2 pr-2 font-medium">State</th>
								{ZONE_FIELDS.map((field) => (
									<th key={field.key} className="pb-2 pr-2 font-medium">
										{field.label}
									</th>
								))}
								<th className="pb-2" aria-label="Remove" />
							</tr>
						</thead>
						<tbody>
							{rows.map((row, index) => (
								// Rows have no id until saved; position is their identity here
								// eslint-disable-next-line react/no-array-index-key
								<tr key={index}>
									<td className="py-1 pr-2">
										<Input
											aria-label="State"
											value={row.state}
											onChange={(e) =>
												setCell(index, "state", e.target.value)
											}
											placeholder="Lagos"
											className="h-9 w-[130px]"
										/>
									</td>
									{ZONE_FIELDS.map((field) => (
										<td key={field.key} className="py-1 pr-2">
											<Input
												aria-label={`${row.state || "State"} ${field.label}`}
												inputMode="decimal"
												value={row[field.key]}
												onChange={(e) =>
													setCell(index, field.key, e.target.value)
												}
												placeholder={String(feeConfig?.[field.key] ?? "")}
												className="h-9 w-[100px]"
											/>
										</td>
									))}
									<td className="py-1">
										<Button
											variant="ghost"
											size="icon"
											aria-label={`Remove ${row.state || "this state"}`}
											onClick={() =>
												setRows((prev) =>
													prev.filter((_, i) => i !== index),
												)
											}
										>
											<Icon icon="lucide:trash-2" className="size-4" />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{error && <p className="text-destructive mt-2 text-sm">{error}</p>}

			<div className="mt-4 flex justify-end">
				<Button
					onClick={save}
					disabled={!changed || updateFeeConfig.isPending}
					className="bg-secondary hover:bg-secondary/90 text-white"
				>
					{updateFeeConfig.isPending ? "Saving..." : "Save state fees"}
				</Button>
			</div>
		</div>
	);
}
