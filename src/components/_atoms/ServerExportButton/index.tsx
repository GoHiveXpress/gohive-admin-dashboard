"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";
import { type ExportDataset, type ExportParams, exportsApi } from "@/services/exports";

interface ServerExportButtonProps {
	dataset: ExportDataset;
	// The filters on screen; the server exports every row that matches them
	params: ExportParams;
	label?: string;
	disabled?: boolean;
	className?: string;
}

/** Downloads a CSV of everything matching the filters. Hidden without the Download permission. */
export default function ServerExportButton({
	dataset,
	params,
	label = "Export all (CSV)",
	disabled,
	className,
}: ServerExportButtonProps) {
	const { allows, isLoading } = usePermissions();
	const [busy, setBusy] = useState(false);

	if (isLoading || !allows(ACTION_RULES.download)) return null;

	const handleExport = async () => {
		setBusy(true);
		try {
			const { rows } = await exportsApi.download(dataset, params);
			toast.success(
				rows === null
					? "Export downloaded"
					: `Exported ${rows.toLocaleString()} ${rows === 1 ? "row" : "rows"}`,
			);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "The export failed.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<Button
			type="button"
			variant="outline"
			className={className}
			disabled={busy || disabled}
			onClick={() => {
				handleExport().catch(() => undefined);
			}}
		>
			{busy ? (
				<Loader2 className="mr-2 size-4 animate-spin" />
			) : (
				<Download className="mr-2 size-4" />
			)}
			{busy ? "Preparing…" : label}
		</Button>
	);
}
