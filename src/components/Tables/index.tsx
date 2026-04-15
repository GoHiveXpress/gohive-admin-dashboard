// src/components/Tables/index.tsx
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, import/prefer-default-export */

"use client";

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	title?: string;
	actionSlot?: React.ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	title,
	actionSlot,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="border-border/50 w-full rounded-[20px] border bg-white p-6 shadow-sm">
			{(title || actionSlot) && (
				<div className="mb-6 flex items-center justify-between">
					{title && <h2 className="text-foreground text-xl font-bold">{title}</h2>}
					{actionSlot && <div>{actionSlot}</div>}
				</div>
			)}
			<div className="overflow-hidden">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-border border-b hover:bg-transparent"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="text-muted-foreground h-12 text-xs font-medium uppercase tracking-wider"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-border/40 hover:bg-muted/10 h-16 border-b transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="text-foreground py-4 text-sm font-medium"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

/* eslint-enable */
