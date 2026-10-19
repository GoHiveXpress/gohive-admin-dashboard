// src/components/GlobalSearch/index.tsx
// The ⌘K / Ctrl+K search across orders, customers, vendors and riders.
// Picking a result opens it in the shared detail panel.

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bike, Loader2, Package, Search, Store, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { type DetailKind, useDetailPanel } from "@/components/DetailPanel";
import { MIN_SEARCH_LENGTH, useGlobalSearch } from "@/hooks/useGlobalSearch";
import { type GlobalSearchResponse, type SearchGroup } from "@/types/search";
import { cn } from "@/lib/utils";

interface ResultItem {
	key: string;
	kind: DetailKind;
	id: string;
	title: string;
	subtitle: string;
}

const GROUPS: { group: SearchGroup; label: string; kind: DetailKind; icon: typeof User }[] = [
	{ group: "orders", label: "Orders", kind: "order", icon: Package },
	{ group: "customers", label: "Customers", kind: "customer", icon: User },
	{ group: "vendors", label: "Vendors", kind: "vendor", icon: Store },
	{ group: "riders", label: "Riders", kind: "rider", icon: Bike },
];

function toItems(group: SearchGroup, data: GlobalSearchResponse["data"]): ResultItem[] {
	const kind = GROUPS.find((entry) => entry.group === group)?.kind ?? "customer";
	if (group === "orders") {
		return (data.orders ?? []).map((order) => ({
			key: `order-${order._id}`,
			kind,
			id: order._id,
			title: `#${order.orderId}`,
			subtitle: [
				order.status.replace(/_/g, " "),
				`₦${order.totalAmount.toLocaleString()}`,
				order.customer?.name,
				order.vendor?.vendorProfile?.businessName ?? order.vendor?.name,
			]
				.filter(Boolean)
				.join(" · "),
		}));
	}
	return (data[group] ?? []).map((user) => ({
		key: `${group}-${user._id}`,
		kind,
		id: user._id,
		title: user.vendorProfile?.businessName ?? user.name,
		subtitle: [user.vendorProfile?.businessName ? user.name : null, user.email, user.phone]
			.filter(Boolean)
			.join(" · "),
	}));
}

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function GlobalSearch() {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const [shortcut, setShortcut] = useState("Ctrl K");
	const listRef = useRef<HTMLDivElement>(null);
	const { open: openDetail } = useDetailPanel();
	const { data, isFetching, isError, ready } = useGlobalSearch(query, isOpen);

	useEffect(() => {
		if (isMac()) setShortcut("⌘K");
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setIsOpen((current) => !current);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const sections = useMemo(() => {
		if (!ready || !data) return [];
		return GROUPS.filter(({ group }) => data.data[group] !== undefined)
			.map((entry) => ({ ...entry, items: toItems(entry.group, data.data) }))
			.filter((section) => section.items.length > 0);
	}, [data, ready]);

	const flat = useMemo(() => sections.flatMap((section) => section.items), [sections]);

	useEffect(() => setActive(0), [flat]);

	useEffect(() => {
		listRef.current
			?.querySelector<HTMLElement>(`[data-index="${active}"]`)
			?.scrollIntoView({ block: "nearest" });
	}, [active]);

	const choose = (item: ResultItem) => {
		setIsOpen(false);
		openDetail({ kind: item.kind, id: item.id });
	};

	const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (flat.length === 0) return;
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActive((index) => (index + 1) % flat.length);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setActive((index) => (index - 1 + flat.length) % flat.length);
		} else if (event.key === "Enter") {
			event.preventDefault();
			const item = flat[active];
			if (item) choose(item);
		}
	};

	const onOpenChange = (next: boolean) => {
		setIsOpen(next);
		if (!next) setQuery("");
	};

	let body: React.ReactNode = null;
	if (!ready) {
		body = (
			<p className="text-muted-foreground px-4 py-8 text-center text-sm">
				Type at least {MIN_SEARCH_LENGTH} characters: an order code, a name, an email or a
				phone number.
			</p>
		);
	} else if (isError) {
		body = (
			<p className="px-4 py-8 text-center text-sm text-red-700">Search failed. Try again.</p>
		);
	} else if (data && flat.length === 0 && !isFetching) {
		body = (
			<p className="text-muted-foreground px-4 py-8 text-center text-sm">
				Nothing matches &ldquo;{query.trim()}&rdquo;.
			</p>
		);
	} else {
		let index = -1;
		body = sections.map((section) => (
			<div key={section.group} className="py-1">
				<p className="text-muted-foreground px-4 pb-1 pt-2 text-xs font-medium uppercase tracking-wider">
					{section.label}
				</p>
				{section.items.map((item) => {
					index += 1;
					const itemIndex = index;
					const ItemIcon = section.icon;
					return (
						<button
							key={item.key}
							type="button"
							data-index={itemIndex}
							onMouseEnter={() => setActive(itemIndex)}
							onClick={() => choose(item)}
							className={cn(
								"flex w-full items-center gap-3 px-4 py-2 text-left",
								itemIndex === active && "bg-muted",
							)}
						>
							<ItemIcon className="text-muted-foreground size-4 shrink-0" />
							<span className="min-w-0">
								<span className="block truncate text-sm font-medium">
									{item.title}
								</span>
								{item.subtitle && (
									<span className="text-muted-foreground block truncate text-xs">
										{item.subtitle}
									</span>
								)}
							</span>
						</button>
					);
				})}
			</div>
		));
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="border-border text-muted-foreground hover:bg-muted flex h-10 items-center gap-2 rounded-md border px-3 text-sm transition-colors"
				aria-label="Search"
			>
				<Search className="size-4" />
				<span className="hidden md:inline">Search...</span>
				<kbd className="bg-muted hidden rounded px-1.5 py-0.5 font-mono text-[10px] md:inline">
					{shortcut}
				</kbd>
			</button>

			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
					<DialogTitle className="sr-only">Search</DialogTitle>
					<DialogDescription className="sr-only">
						Search orders, customers, vendors and riders
					</DialogDescription>
					<div className="flex items-center gap-2 border-b px-4">
						<Search className="text-muted-foreground size-4 shrink-0" />
						<input
							// The palette exists to be typed into straight away.
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus
							aria-label="Search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							onKeyDown={onInputKeyDown}
							placeholder="Search orders, customers, vendors, riders..."
							className="h-12 flex-1 bg-transparent text-sm outline-none"
						/>
						{isFetching && (
							<Loader2 className="text-muted-foreground size-4 animate-spin" />
						)}
					</div>
					<div ref={listRef} className="max-h-[60vh] overflow-y-auto py-1">
						{body}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
