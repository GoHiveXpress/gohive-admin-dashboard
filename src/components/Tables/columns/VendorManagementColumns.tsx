// src/components/Tables/columns/VendorManagementColumns.tsx
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type BaseColumnSchema } from "../types";

export type VendorData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: "Active" | "Inactive";
	kyc: "Verified" | "Unverified";
	rating: number;
};

export const vendorColumnsConfig: BaseColumnSchema<VendorData>[] = [
	{
		key: "name",
		header: "Name",
		render: (row) => (
			<div className="flex items-center gap-2">
				{/* Green online dot */}
				<div
					className={`size-2 rounded-full ${row.status === "Active" ? "bg-secondary" : "bg-muted"}`}
				/>
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
		render: (row) => {
			const isActive = row.status === "Active";
			return (
				<Badge
					variant="outline"
					className={`rounded-full border-none px-3 py-1 font-medium ${
						isActive
							? "bg-secondary/10 text-secondary"
							: "bg-muted text-muted-foreground"
					}`}
				>
					<div
						className={`mr-2 size-2 rounded-full ${
							isActive ? "bg-secondary" : "bg-muted-foreground"
						}`}
					/>
					{row.status}
				</Badge>
			);
		},
	},
	{
		key: "kyc",
		header: "KYC",
		render: (row) => {
			const isVerified = row.kyc === "Verified";
			return (
				<Badge
					variant="outline"
					className={`rounded-[6px] border-none px-4 py-1 font-medium ${
						isVerified
							? "bg-secondary hover:bg-secondary/90 text-white"
							: "bg-destructive hover:bg-destructive/90 text-white"
					}`}
				>
					<div className="mr-2 size-2 rounded-full bg-white" />
					{row.kyc}
				</Badge>
			);
		},
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
			<Link href={`/vendor-management/${row.id}`}>
				<Button variant="ghost" size="icon" className="text-foreground size-8">
					<Icon icon="ph:eye" width="20" />
				</Button>
			</Link>
		),
	},
];
