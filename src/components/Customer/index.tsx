"use client";

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomTabs, { type TabItem } from "@/components/Tabs";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useCustomer } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerProfileTab from "./CustomerProfileTabs";
import CustomerOrderTab from "./CustomerOrderTabs";
import CustomerFeedbackTab from "./CustomerFeedbackTabs";

const TABS: TabItem[] = [
	{ id: "profile", label: "Profile" },
	{ id: "orders", label: "Order History" },
	{ id: "feedback", label: "Feedback" },
];

export default function SingleCustomerView({ id }: { id: string }) {
	const [activeTab, setActiveTab] = useState("profile");
	const { data: customerResponse, isLoading, error } = useCustomer(id);
	const customer = customerResponse?.data;

	if (isLoading) {
		return (
			<div className="mx-auto w-full max-w-5xl space-y-6">
				<Skeleton className="h-10 w-32" />
				<Skeleton className="h-48 w-full rounded-[20px]" />
				<Skeleton className="h-96 w-full rounded-[20px]" />
			</div>
		);
	}

	if (error || !customer) {
		return (
			<div className="mx-auto w-full max-w-5xl p-12 text-center">
				<p className="text-destructive font-medium">
					Failed to load customer profile. Please try again.
				</p>
			</div>
		);
	}

	const displayId = `GH-${customer._id.slice(-8)}`;

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			<div className="mb-6 flex items-start justify-between">
				<h1 className="text-foreground text-2xl font-bold">Profile</h1>
				<Link href={ROUTES.CUSTOMERS}>
					<Button
						variant="ghost"
						size="icon"
						className="bg-muted/50 hover:bg-muted rounded-full"
					>
						<Icon icon="ph:arrow-u-up-left-bold" width="20" />
					</Button>
				</Link>
			</div>

			{/* Top Header Card */}
			<div className="border-border/50 relative rounded-[20px] border bg-white p-6 shadow-sm">
				<div className="mb-8 flex items-center gap-4">
					<Avatar className="size-20 border-2 border-white shadow-sm">
						<AvatarImage src="" /> {/* Add image if available */}
						<AvatarFallback className="text-foreground bg-[#E3D5C0] text-2xl font-medium">
							{customer.name.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-foreground text-xl font-bold">{customer.name}</h2>
						<div className="mt-1 flex items-center gap-2">
							<span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
								User ID Number:
							</span>
							<Badge
								variant="outline"
								className="border-border text-foreground bg-white px-2 py-0.5 text-[10px] font-normal"
							>
								{displayId}
							</Badge>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="bg-muted/30 rounded-full p-1.5">
						<CustomTabs
							items={TABS}
							activeTab={activeTab}
							onTabChange={setActiveTab}
							className="gap-1"
						/>
					</div>

					<Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full border-none px-4 py-1.5 font-medium">
						<div className="bg-secondary mr-2 size-2 rounded-full" />
						{customer.accountStatus}
					</Badge>
				</div>
			</div>

			{/* Tab Content */}
			<div className="transition-all duration-300">
				{activeTab === "profile" && <CustomerProfileTab customer={customer} />}
				{activeTab === "orders" && <CustomerOrderTab id={id} />}
				{activeTab === "feedback" && <CustomerFeedbackTab id={id} />}
			</div>
		</div>
	);
}

/* eslint-enable */
