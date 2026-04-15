/* eslint-disable @typescript-eslint/no-unused-vars, default-case */
import { type BaseColumnSchema } from "@/components/Tables/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export type CustomerData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: "Active" | "Inactive" | "Suspend";
	orders: number;
};

export const customerColumnsConfig: BaseColumnSchema<CustomerData>[] = [
	{
		key: "name",
		header: "Name",
		render: (row) => <span className="text-foreground font-medium">{row.name}</span>,
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
			let variantClass = "";
			let dotClass = "";

			switch (row.status) {
				case "Active":
					variantClass = "bg-secondary/10 text-secondary";
					dotClass = "bg-secondary";
					break;
				case "Inactive":
					variantClass = "bg-[#FDB900]/10 text-[#FDB900]";
					dotClass = "bg-[#FDB900]";
					break;
				case "Suspend":
					variantClass = "bg-destructive/10 text-destructive";
					dotClass = "bg-destructive";
					break;
			}

			return (
				<Badge
					variant="outline"
					className={`rounded-full border-none px-3 py-1 font-medium ${variantClass}`}
				>
					<div className={`mr-2 size-2 rounded-full ${dotClass}`} />
					{row.status}
				</Badge>
			);
		},
	},
	{
		key: "orders",
		header: "Orders",
		render: (row) => <span className="text-foreground pl-4 font-medium">{row.orders}</span>,
	},
	{
		key: "action",
		header: "",
		render: (row) => (
			<Link href={`/customer-management/${row.id}`}>
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-primary hover:bg-muted size-8"
				>
					<Icon icon="ph:eye" width="20" />
				</Button>
			</Link>
		),
	},
];

/* eslint-enable */
