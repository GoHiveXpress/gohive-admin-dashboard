"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { PanelHeader } from "@/components/_atoms/OrderAtoms";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS, type Permission } from "@/lib/permissions";
import { ROUTES } from "@/constants/routes";
import { type Order } from "@/types/customerManagement";

interface Contact {
	role: string;
	name: string;
	phone?: string;
	email?: string;
	profile?: string;
	profilePermission: Permission;
}

const linkClass =
	"border-border text-foreground hover:bg-muted inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs";

/** Call, email or open the profile of everyone on the order. */
export default function OrderContactPanel({ order }: { order?: Order | null }) {
	const { can } = usePermissions();
	if (!order) return null;

	const contacts: Contact[] = [
		{
			role: "Customer",
			name: order.customer?.name ?? "Unknown customer",
			phone: order.customer?.phone,
			email: order.customer?.email,
			profile: order.customer?._id ? ROUTES.CUSTOMER_DETAILS(order.customer._id) : undefined,
			profilePermission: PERMISSIONS.CUSTOMERS,
		},
		{
			role: "Vendor",
			name:
				order.vendor?.vendorProfile?.businessName ?? order.vendor?.name ?? "Unknown vendor",
			phone: order.vendor?.phone,
			email: order.vendor?.email,
			profile: order.vendor?._id ? `${ROUTES.VENDORS}/${order.vendor._id}` : undefined,
			profilePermission: PERMISSIONS.VENDORS,
		},
	];
	if (order.rider) {
		contacts.push({
			role: "Rider",
			name: order.rider.name,
			phone: order.rider.phone,
			email: order.rider.email,
			profile: order.rider._id ? `${ROUTES.RIDERS}/${order.rider._id}` : undefined,
			profilePermission: PERMISSIONS.RIDERS,
		});
	}

	return (
		<div className="bg-card border-border rounded-xl border p-6 shadow-sm">
			<PanelHeader title="Contact" />
			<ul className="space-y-4">
				{contacts.map((contact) => (
					<li key={contact.role} className="space-y-1.5">
						<p className="text-sm">
							<span className="text-muted-foreground">{contact.role}: </span>
							<span className="text-foreground font-medium">{contact.name}</span>
						</p>
						<div className="flex flex-wrap gap-2">
							{contact.phone && (
								<a
									href={`tel:${contact.phone}`}
									className={linkClass}
									aria-label={`Call ${contact.role.toLowerCase()} ${contact.name}`}
								>
									<Icon icon="lucide:phone" className="size-3.5" />
									{contact.phone}
								</a>
							)}
							{contact.email && (
								<a
									href={`mailto:${contact.email}`}
									className={linkClass}
									aria-label={`Email ${contact.role.toLowerCase()} ${contact.name}`}
								>
									<Icon icon="lucide:mail" className="size-3.5" />
									Email
								</a>
							)}
							{contact.profile && can(contact.profilePermission) && (
								<Link href={contact.profile} className={linkClass}>
									<Icon icon="lucide:user" className="size-3.5" />
									Profile
								</Link>
							)}
							{!contact.phone && !contact.email && (
								<span className="text-muted-foreground text-xs">
									No contact details on file
								</span>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
