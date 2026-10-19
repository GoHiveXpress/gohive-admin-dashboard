// src/components/_atoms/TableExport/index.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { jsPDF as JsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";

interface ExportColumn {
	header: string;
	key: string;
}

interface TableExportProps<T extends object> {
	data: T[];
	columns: ExportColumn[];
	filename?: string;
	title?: string;
}

const cellValue = (row: object, key: string): unknown => (row as Record<string, unknown>)[key];

export default function TableExport<T extends object>({
	data,
	columns,
	filename = "report",
	title = "Report",
}: TableExportProps<T>) {
	const { allows, isLoading } = usePermissions();
	// Exports need the "Download" permission (superadmins always have it).
	const canDownload = !isLoading && allows(ACTION_RULES.download);

	const handleExportPDF = () => {
		const doc = new JsPDF();
		doc.text(title, 14, 15);

		const tableHeaders = columns.map((col) => col.header);
		const tableData = data.map((row) =>
			columns.map((col) => {
				const val = cellValue(row, col.key);
				// Format if it's an object or date
				if (val instanceof Date) return val.toLocaleDateString();
				return val === null || val === undefined ? "" : String(val);
			}),
		);

		autoTable(doc, {
			head: [tableHeaders],
			body: tableData,
			startY: 20,
			theme: "grid",
			headStyles: { fillColor: [10, 10, 10] }, // Using a dark color for headers
		});

		doc.save(`${filename}.pdf`);
	};

	const handleExportCSV = () => {
		// Create an object with only the columns we want
		const exportData = data.map((row) => {
			const obj: Record<string, unknown> = {};
			columns.forEach((col) => {
				obj[col.header] = cellValue(row, col.key);
			});
			return obj;
		});

		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
		XLSX.writeFile(workbook, `${filename}.csv`);
	};

	if (!canDownload) return null;

	return (
		<div className="flex gap-3">
			<Button
				onClick={handleExportPDF}
				className="bg-secondary hover:bg-secondary/90 h-10 w-20 text-white"
			>
				PDF
			</Button>
			<Button
				onClick={handleExportCSV}
				className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-20"
			>
				CSV
			</Button>
		</div>
	);
}
