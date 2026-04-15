// src/components/Tables/columns/RiderManagementColumns.tsx
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type BaseColumnSchema } from "../types";

export type RiderData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: string;
	kyc: string;
	rating: number;
};

export const riderColumnsConfig: BaseColumnSchema<RiderData>[] = [
	{
		key: "name",
		header: "Name",
		render: (row) => (
			<div className="flex items-center gap-2">
				<div className="bg-secondary size-2 rounded-full" />
				<span className="text-foreground font-medium">{row.name}</span>
			</div>
		),
	},
	{
		key: "email",
		header: "Email",
		render: (row) => <span className="text-foreground">{row.email}</span>,
	},
	{
		key: "phone",
		header: "Phone",
		render: (row) => <span className="text-foreground">{row.phone}</span>,
	},
	{
		key: "status",
		header: "Status",
		render: (row) => (
			<Badge
				variant="outline"
				className="bg-secondary/10 text-secondary rounded-full border-none px-3 py-1 font-medium"
			>
				<div className="bg-secondary mr-2 size-2 rounded-full" />
				{/* This will now display 'Online', 'Offline', etc. */}
				{row.status}
			</Badge>
		),
	},
	{
		key: "kyc",
		header: "KYC",
		render: (row) => (
			<Badge className="bg-secondary hover:bg-secondary/90 rounded-[6px] border-none px-4 py-1 font-medium text-white">
				<div className="mr-2 size-2 rounded-full bg-white" />
				{/* This will now display 'Approved', 'Pending', etc. */}
				{row.kyc}
			</Badge>
		),
	},
	{
		key: "rating",
		header: "Rating",
		render: (row) => (
			<div className="flex items-center gap-1">
				<Icon icon="ph:star-fill" className="text-primary size-5" />
				<span className="text-foreground font-medium">{row.rating.toFixed(1)}</span>
			</div>
		),
	},
	{
		key: "action",
		header: "",
		render: (row) => (
			<Link href={`/rider-management/${row.id}`}>
				<Button
					variant="ghost"
					size="icon"
					className="text-foreground hover:bg-muted size-8"
				>
					<Icon icon="ph:eye" width="20" />
				</Button>
			</Link>
		),
	},
];
