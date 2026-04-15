/* eslint-disable react/no-unescaped-entities */
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type BaseColumnSchema } from "../types";

// Define the Data Type matching the screenshot
export type ActiveUserData = {
	id: string;
	name: string;
	userType: "Rider" | "Vendor";
	userId: string; // e.g. RGHV0923
	image: string;
	location: string;
	phone: string;
	status: "Active" | "Online" | "Offline";
	activeOrder: string | number; // e.g. "Yes", "No", or "12"
	rating: number;
};

export const activeUsersColumnConfig: BaseColumnSchema<ActiveUserData>[] = [
	{
		key: "name",
		header: "Name",
		render: (row) => (
			<div className="flex items-center gap-3">
				{/* Status Dot Indicator on Avatar */}
				<div className="relative">
					<div
						className={`absolute -left-1 top-1/2 size-2 -translate-y-1/2 rounded-full ${
							row.status === "Active" || row.status === "Online"
								? "bg-secondary"
								: "bg-gray-300"
						}`}
					/>
					<Avatar className="ml-3 size-10">
						<AvatarImage src={row.image} />
						<AvatarFallback className="bg-muted text-muted-foreground font-medium">
							{row.name.charAt(0)}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-col">
					<span className="text-foreground text-sm font-bold">{row.name}</span>
					<div className="border-border mt-0.5 flex w-fit items-center gap-1 rounded-full border px-2 py-0.5">
						<span className="text-muted-foreground whitespace-nowrap text-[10px]">
							{row.userType}'s ID Number:{" "}
							<span className="text-foreground font-medium">{row.userId}</span>
						</span>
					</div>
				</div>
			</div>
		),
	},
	{
		key: "location",
		header: "Current Location",
		render: (row) => <span className="text-foreground text-sm">{row.location}</span>,
	},
	{
		key: "phone",
		header: "Phone",
		render: (row) => <span className="text-foreground text-sm font-medium">{row.phone}</span>,
	},
	{
		key: "status",
		header: "Status",
		render: (row) => (
			<Badge
				variant="outline"
				className="bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full border-none px-3 py-1 font-medium"
			>
				<div className="bg-secondary mr-2 size-2 rounded-full" />
				{row.status}
			</Badge>
		),
	},
	{
		key: "activeOrder",
		header: "Active Order",
		render: (row) => {
			// Styling active orders (Green for Yes, Red for No, Gray for Numbers)
			let bgClass = "bg-muted text-foreground"; // Default gray for numbers
			let dotClass = "";

			if (row.activeOrder === "Yes") {
				bgClass = "bg-secondary/10 text-foreground border border-secondary/20";
				dotClass = "bg-secondary";
			} else if (row.activeOrder === "No") {
				bgClass = "bg-destructive/10 text-foreground border border-destructive/20";
				dotClass = "bg-destructive";
			}

			return (
				<Badge
					variant="secondary"
					className={`rounded-full px-4 py-1 font-normal ${bgClass}`}
				>
					{dotClass && <div className={`size-2 rounded-full ${dotClass} mr-2`} />}
					{row.activeOrder}
				</Badge>
			);
		},
	},
	{
		key: "rating",
		header: "Rating",
		render: (row) => (
			<div className="text-foreground flex items-center gap-1 font-semibold">
				<Icon icon="ph:star-fill" className="text-primary" width="16" />
				{row.rating.toFixed(1)}
			</div>
		),
	},
	{
		key: "action",
		header: "",
		render: () => (
			<Button variant="ghost" size="icon" className="text-foreground hover:bg-muted size-8">
				<Icon icon="ph:dots-three-vertical-bold" width="20" />
			</Button>
		),
	},
];

/* eslint-enable */
