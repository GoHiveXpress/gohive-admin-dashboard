"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomTabs, { TabItem } from "@/components/Tabs";

// Sub-components
import CustomerProfileTab from "./CustomerProfileTabs";
import CustomerOrderTab from "./CustomerOrderTabs";
import CustomerFeedbackTab from "./CustomerFeedbackTabs";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useCustomer } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";

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
			<div className="w-full max-w-5xl mx-auto space-y-6">
				<Skeleton className="h-10 w-32" />
				<Skeleton className="h-48 w-full rounded-[20px]" />
				<Skeleton className="h-96 w-full rounded-[20px]" />
			</div>
		);
	}

	if (error || !customer) {
		return (
			<div className="w-full max-w-5xl mx-auto p-12 text-center">
				<p className="text-destructive font-medium">Failed to load customer profile. Please try again.</p>
			</div>
		);
	}

	const displayId = `GH-${customer._id.slice(-8)}`;

	return (
		<div className="w-full max-w-5xl mx-auto space-y-6">
			<div className="flex justify-between items-start mb-6">
				<h1 className="text-2xl font-bold text-foreground">Profile</h1>
				<Link href={ROUTES.CUSTOMERS}>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full bg-muted/50 hover:bg-muted"
					>
						<Icon icon="ph:arrow-u-up-left-bold" width="20" />
					</Button>
				</Link>
			</div>

			{/* Top Header Card */}
			<div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50 relative">
				<div className="flex items-center gap-4 mb-8">
					<Avatar className="h-20 w-20 border-2 border-white shadow-sm">
						<AvatarImage src="" /> {/* Add image if available */}
						<AvatarFallback className="bg-[#E3D5C0] text-foreground text-2xl font-medium">
							{customer.name.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
						<div className="flex items-center gap-2 mt-1">
							<span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
								User ID Number:
							</span>
							<Badge
								variant="outline"
								className="text-[10px] bg-white border-border text-foreground font-normal px-2 py-0.5"
							>
								{displayId}
							</Badge>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="bg-muted/30 p-1.5 rounded-full">
						<CustomTabs
							items={TABS}
							activeTab={activeTab}
							onTabChange={setActiveTab}
							className="gap-1"
						/>
					</div>

					<Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-4 py-1.5 rounded-full font-medium">
						<div className="w-2 h-2 rounded-full bg-secondary mr-2" />
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
