// src/components/_atoms/TableExport/index.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ExportColumn {
	header: string;
	key: string;
}

interface TableExportProps {
	data: any[];
	columns: ExportColumn[];
	filename?: string;
	title?: string;
}

export default function TableExport({
	data,
	columns,
	filename = "report",
	title = "Report",
}: TableExportProps) {
	const handleExportPDF = () => {
		const doc = new jsPDF();
		doc.text(title, 14, 15);

		const tableHeaders = columns.map((col) => col.header);
		const tableData = data.map((row) =>
			columns.map((col) => {
				const val = row[col.key];
				// Format if it's an object or date
				if (val instanceof Date) return val.toLocaleDateString();
				return val?.toString() || "";
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
			const obj: any = {};
			columns.forEach((col) => {
				obj[col.header] = row[col.key];
			});
			return obj;
		});

		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
		XLSX.writeFile(workbook, `${filename}.csv`);
	};

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
