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
	profilePicture: string;
};

export const riderColumnsConfig: BaseColumnSchema<RiderData>[] = [
	{
		key: "name",
		header: "Name",
		render: (row) => (
			<div className="flex items-center gap-3">
				{row.profilePicture ? (
					<img src={row.profilePicture} alt={row.name} className="size-8 rounded-full object-cover shadow-sm" />
				) : (
					<div className="flex size-8 items-center justify-center rounded-full bg-secondary/10">
						<Icon icon="ph:user" className="size-4 text-secondary" />
					</div>
				)}
				<div className="flex flex-col">
					<span className="text-foreground font-medium">{row.name}</span>
				</div>
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
			const isOnline = row.status.toLowerCase() === "online";
			return (
				<Badge
					variant="outline"
					className={`rounded-full border-none px-3 py-1 font-medium ${
						isOnline
							? "bg-[#E8F5E9] text-[#22C55E]"
							: "bg-[#F4F4F5] text-[#71717A]"
					}`}
				>
					<div className={`mr-2 size-2 rounded-full ${isOnline ? "bg-[#22C55E]" : "bg-[#71717A]"}`} />
					{row.status}
				</Badge>
			);
		},
	},
	{
		key: "kyc",
		header: "KYC",
		render: (row) => {
			const status = row.kyc.toLowerCase();
			let bg = "bg-secondary";
			if (status === "pending") bg = "bg-yellow-500";
			else if (status === "rejected") bg = "bg-red-500";

			return (
				<Badge className={`${bg} hover:${bg} rounded-[6px] border-none px-4 py-1 font-medium text-white shadow-none`}>
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
