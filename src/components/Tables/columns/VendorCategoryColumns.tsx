// src/components/Tables/columns/VendorCategoryColumns.tsx
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { type BaseColumnSchema } from "../types";

export type VendorCategoryData = {
	id: string;
	image: string;
	title: string;
	subtitle: string;
	value: string;
	color: string;
};

export const getVendorCategoryColumns = (
	onDelete: (id: string) => void,
	onEdit: (row: VendorCategoryData) => void
): BaseColumnSchema<VendorCategoryData>[] => [
	{
		key: "image",
		header: "Image",
		render: (row) => (
			<div 
				className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"
				style={{ backgroundColor: row.color }}
			>
				<img src={row.image} alt={row.title} className="h-6 w-6 object-contain" />
			</div>
		),
	},
	{
		key: "title",
		header: "Title",
		render: (row) => (
			<div className="flex flex-col">
				<span className="font-bold text-[#17110A]">{row.title}</span>
				<span className="text-[10px] leading-tight text-muted-foreground">{row.subtitle}</span>
			</div>
		),
	},
	{
		key: "value",
		header: "Value",
		render: (row) => (
			<span className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
				{row.value}
			</span>
		),
	},
	{
		key: "color",
		header: "Color",
		render: (row) => (
			<div className="flex items-center gap-2">
				<div className="h-3 w-3 rounded-full border shadow-sm" style={{ backgroundColor: row.color }} />
				<span className="text-[11px] font-mono font-medium">{row.color}</span>
			</div>
		),
	},
	{
		key: "action",
		header: "Actions",
		render: (row) => (
			<div className="flex justify-end gap-2 pr-4">
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-all active:scale-95"
					onClick={() => onEdit(row)}
				>
					<Icon icon="ph:pencil-line-bold" className="size-5" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95"
					onClick={() => {
						if (confirm("Are you sure you want to delete this category?")) {
							onDelete(row.id);
						}
					}}
				>
					<Icon icon="ph:trash-bold" className="size-5" />
				</Button>
			</div>
		),
	},
];
