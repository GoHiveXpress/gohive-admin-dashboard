// src/components/DetailPanel/index.tsx
// One side panel for a quick look at an order, customer, vendor or rider.
// Anything inside the gated pages can open it with useDetailPanel().open(...).

"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/customerManagement";
import { useCustomer, useRider, useVendor } from "@/hooks/userManagement";

export type DetailKind = "order" | "customer" | "vendor" | "rider";

export interface DetailTarget {
	kind: DetailKind;
	id: string;
}

interface DetailPanelContextValue {
	open: (target: DetailTarget) => void;
	close: () => void;
}

const DetailPanelContext = createContext<DetailPanelContextValue | null>(null);

export function useDetailPanel() {
	const context = useContext(DetailPanelContext);
	if (!context) throw new Error("useDetailPanel must be used inside DetailPanelProvider");
	return context;
}

const PROFILE_PATHS: Record<Exclude<DetailKind, "order">, string> = {
	customer: "/customer-management",
	vendor: "/vendor-management",
	rider: "/rider-management",
};

const formatNaira = (amount?: number) => `₦${(amount ?? 0).toLocaleString()}`;
const formatDate = (value?: string) => (value ? new Date(value).toLocaleString() : "—");
const formatStatus = (status?: string) => (status ? status.replace(/_/g, " ") : "—");

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4 border-b py-2.5 text-sm last:border-b-0">
			<span className="text-muted-foreground shrink-0">{label}</span>
			<span className="text-right font-medium">{children}</span>
		</div>
	);
}

function PanelSkeleton() {
	return (
		<div className="space-y-3">
			{[0, 1, 2, 3, 4].map((row) => (
				<Skeleton key={row} className="h-6 w-full" />
			))}
		</div>
	);
}

function PanelError({ what }: { what: string }) {
	return <p className="text-sm text-red-700">Couldn&apos;t load this {what}.</p>;
}

function ProfileLink({ href, label }: { href: string; label: string }) {
	return (
		<Link
			href={href}
			className="text-primary mt-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
		>
			{label}
			<ExternalLink className="size-3.5" />
		</Link>
	);
}

function OrderDetails({
	id,
	onNavigate,
}: {
	id: string;
	onNavigate: DetailPanelContextValue["open"];
}) {
	const { data, isLoading, isError } = useOrder(id);
	const order = data?.data;
	if (isLoading) return <PanelSkeleton />;
	if (isError || !order) return <PanelError what="order" />;

	const customerId = order.customer?._id;
	const vendorId = order.vendor?._id;

	return (
		<div>
			<Field label="Order">{order.orderId}</Field>
			<Field label="Status">
				<Badge variant="outline" className="capitalize">
					{formatStatus(order.status)}
				</Badge>
			</Field>
			<Field label="Total">{formatNaira(order.totalAmount)}</Field>
			<Field label="Placed">{formatDate(order.createdAt)}</Field>
			<Field label="Customer">
				{customerId ? (
					<button
						type="button"
						className="text-primary hover:underline"
						onClick={() => onNavigate({ kind: "customer", id: customerId })}
					>
						{order.customer.name}
					</button>
				) : (
					(order.customer?.name ?? "—")
				)}
			</Field>
			<Field label="Vendor">
				{vendorId ? (
					<button
						type="button"
						className="text-primary hover:underline"
						onClick={() => onNavigate({ kind: "vendor", id: vendorId })}
					>
						{order.vendor.vendorProfile?.businessName ?? "Vendor"}
					</button>
				) : (
					(order.vendor?.vendorProfile?.businessName ?? "—")
				)}
			</Field>
			<Field label="Rider">{order.rider?.name ?? "Not assigned"}</Field>
			<Field label="Deliver to">{order.deliveryAddress?.address ?? "—"}</Field>
			{order.items && order.items.length > 0 && (
				<div className="mt-4">
					<p className="text-muted-foreground mb-2 text-sm">Items</p>
					<ul className="space-y-1 text-sm">
						{order.items.map((item, index) => (
							// Items have no id of their own.
							// eslint-disable-next-line react/no-array-index-key
							<li key={index}>
								{item.quantity} × {item.name ?? "Item"}
							</li>
						))}
					</ul>
				</div>
			)}
			<ProfileLink
				href={`/order-management?search=${encodeURIComponent(order.orderId)}`}
				label="Open in order management"
			/>
		</div>
	);
}

function UserDetails({ kind, id }: { kind: Exclude<DetailKind, "order">; id: string }) {
	const customer = useCustomer(id, kind === "customer");
	const vendor = useVendor(id, kind === "vendor");
	const rider = useRider(id, kind === "rider");

	const query = { customer, vendor, rider }[kind];
	if (query.isLoading) return <PanelSkeleton />;
	const user = query.data?.data;
	if (query.isError || !user) return <PanelError what={kind} />;

	const vendorProfile = kind === "vendor" ? vendor.data?.data.vendorProfile : undefined;
	const riderProfile = kind === "rider" ? rider.data?.data.riderProfile : undefined;
	const orderCount = kind === "customer" ? customer.data?.data.orderCount : undefined;

	return (
		<div>
			{vendorProfile && <Field label="Business">{vendorProfile.businessName}</Field>}
			<Field label="Name">{user.name}</Field>
			<Field label="Email">{user.email || "—"}</Field>
			<Field label="Phone">{user.phone || "—"}</Field>
			<Field label="Account">
				<Badge variant="outline">{user.accountStatus}</Badge>
			</Field>
			{vendorProfile && (
				<>
					<Field label="Verification">
						<span className="capitalize">{vendorProfile.verificationStatus}</span>
					</Field>
					<Field label="Address">{vendorProfile.businessAddress || "—"}</Field>
				</>
			)}
			{riderProfile && (
				<>
					<Field label="Verification">
						<span className="capitalize">{riderProfile.verificationStatus}</span>
					</Field>
					<Field label="Availability">
						<span className="capitalize">{riderProfile.availabilityStatus}</span>
					</Field>
					<Field label="Vehicle">
						{riderProfile.vehicleType} {riderProfile.vehiclePlateNumber}
					</Field>
				</>
			)}
			{typeof orderCount === "number" && <Field label="Orders">{orderCount}</Field>}
			<Field label="Joined">{formatDate(user.createdAt)}</Field>
			<ProfileLink
				href={`${PROFILE_PATHS[kind]}/${id}`}
				label={`Open full ${kind} profile`}
			/>
		</div>
	);
}

const TITLES: Record<DetailKind, string> = {
	order: "Order",
	customer: "Customer",
	vendor: "Vendor",
	rider: "Rider",
};

export default function DetailPanelProvider({ children }: { children: React.ReactNode }) {
	const [target, setTarget] = useState<DetailTarget | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback((next: DetailTarget) => {
		setTarget(next);
		setIsOpen(true);
	}, []);
	const close = useCallback(() => setIsOpen(false), []);
	const value = useMemo(() => ({ open, close }), [open, close]);

	return (
		<DetailPanelContext.Provider value={value}>
			{children}
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
					{target && (
						<>
							<SheetHeader className="mb-4">
								<SheetTitle>{TITLES[target.kind]} details</SheetTitle>
								<SheetDescription>
									A quick look without leaving this page.
								</SheetDescription>
							</SheetHeader>
							{target.kind === "order" ? (
								<OrderDetails key={target.id} id={target.id} onNavigate={open} />
							) : (
								<UserDetails
									key={`${target.kind}-${target.id}`}
									kind={target.kind}
									id={target.id}
								/>
							)}
						</>
					)}
				</SheetContent>
			</Sheet>
		</DetailPanelContext.Provider>
	);
}
