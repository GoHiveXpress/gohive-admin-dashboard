// src/components/Settings/AuditLogTab/index.tsx
// Superadmin-only, read-only view of GET /admin/audit-logs.

"use client";

/* eslint-disable no-nested-ternary */

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { DataTable } from "@/components/Tables";
import TablePagination from "@/components/Tables/Pagination";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { type BaseColumnSchema } from "@/components/Tables/types";
import AccessDenied from "@/components/_atoms/AccessDenied";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { useAdmins } from "@/hooks/userManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { useDebounce } from "@/hooks/useDebounce";
import { ACTION_RULES } from "@/lib/permissions";
import { type AuditLogEntry, type AuditLogFilters } from "@/types/auditLog";

const PAGE_SIZE = 25;
const ALL = "all";

// Action names are "<area>.<thing>.<verb>"; the backend filters by prefix, so
// picking an area returns every action in it.
const ACTION_GROUPS = [
	{ value: "vendor.", label: "Vendors" },
	{ value: "rider.", label: "Riders" },
	{ value: "account.", label: "Account status" },
	{ value: "order.", label: "Orders & refunds" },
	{ value: "admin.", label: "Admins & permissions" },
	{ value: "staff.", label: "Staff invitations" },
	{ value: "template.", label: "Notification templates" },
	{ value: "communication.", label: "Broadcasts" },
	{ value: "apikey.", label: "API keys" },
	{ value: "webhook.", label: "Webhooks" },
	{ value: "feeconfig.", label: "Fee config" },
];

// <input type="date"> gives a local calendar day; send the start/end of that
// day so "to" includes the whole day rather than stopping at midnight.
const startOfDayIso = (day: string) => new Date(`${day}T00:00:00`).toISOString();
const endOfDayIso = (day: string) => new Date(`${day}T23:59:59.999`).toISOString();

const formatTimestamp = (value: string) => {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : format(date, "dd MMM yyyy, HH:mm:ss");
};

const actorLabel = (entry: AuditLogEntry) =>
	entry.actor?.name ?? entry.actor?.email ?? entry.actorEmail ?? "Deleted admin";

function OutcomeBadge({ entry }: { entry: AuditLogEntry }) {
	const ok = entry.success === true;
	return (
		<Badge
			variant="outline"
			className={
				ok
					? "border-green-200 bg-green-50 text-green-700"
					: "border-red-200 bg-red-50 text-red-700"
			}
		>
			{ok ? "Success" : "Failed"}
			{entry.statusCode ? ` · ${entry.statusCode}` : ""}
		</Badge>
	);
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-[120px_1fr] gap-3 border-b border-zinc-100 py-2.5 text-sm last:border-b-0">
			<span className="text-muted-foreground">{label}</span>
			<span className="text-foreground break-all font-medium">{children}</span>
		</div>
	);
}

export default function AuditLogTab() {
	const { allows, isLoading: permissionsLoading } = usePermissions();
	const canView = allows(ACTION_RULES.viewAuditLog);

	const [page, setPage] = useState(1);
	const [actor, setActor] = useState(ALL);
	const [action, setAction] = useState(ALL);
	const [outcome, setOutcome] = useState(ALL);
	const [targetIdInput, setTargetIdInput] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [selected, setSelected] = useState<AuditLogEntry | null>(null);

	const targetId = useDebounce(targetIdInput.trim(), 400);

	const filters = useMemo<AuditLogFilters>(
		() => ({
			page,
			limit: PAGE_SIZE,
			actor: actor === ALL ? undefined : actor,
			action: action === ALL ? undefined : action,
			success: outcome === ALL ? undefined : (outcome as "true" | "false"),
			targetId: targetId || undefined,
			from: from ? startOfDayIso(from) : undefined,
			to: to ? endOfDayIso(to) : undefined,
		}),
		[page, actor, action, outcome, targetId, from, to],
	);

	const { data, isLoading, isFetching, error } = useAuditLogs(filters, canView);
	const { data: adminsResponse } = useAdmins();
	const admins = adminsResponse?.data ?? [];

	// Any filter change goes back to the first page.
	const withPageReset =
		<T,>(setter: (value: T) => void) =>
		(value: T) => {
			setter(value);
			setPage(1);
		};

	const hasFilters =
		actor !== ALL ||
		action !== ALL ||
		outcome !== ALL ||
		targetIdInput !== "" ||
		from !== "" ||
		to !== "";

	const clearFilters = () => {
		setActor(ALL);
		setAction(ALL);
		setOutcome(ALL);
		setTargetIdInput("");
		setFrom("");
		setTo("");
		setPage(1);
	};

	const columns = useMemo<BaseColumnSchema<AuditLogEntry>[]>(
		() => [
			{
				key: "createdAt",
				header: "Time",
				render: (row) => (
					<span className="whitespace-nowrap">{formatTimestamp(row.createdAt)}</span>
				),
			},
			{
				key: "actor",
				header: "Admin",
				render: (row) => (
					<div className="flex flex-col">
						<span className="font-semibold">{actorLabel(row)}</span>
						<span className="text-muted-foreground text-xs capitalize">
							{row.actor?.role ?? row.actorRole ?? ""}
						</span>
					</div>
				),
			},
			{
				key: "action",
				header: "Action",
				render: (row) => <code className="text-xs">{row.action}</code>,
			},
			{
				key: "targetId",
				header: "Target",
				render: (row) => (
					<span className="text-muted-foreground font-mono text-xs">
						{row.targetId ? `…${row.targetId.slice(-8)}` : "—"}
					</span>
				),
			},
			{
				key: "success",
				header: "Outcome",
				render: (row) => <OutcomeBadge entry={row} />,
			},
			{
				key: "view",
				header: "",
				render: (row) => (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSelected(row)}
						className="text-secondary"
					>
						View
					</Button>
				),
			},
		],
		[],
	);

	if (permissionsLoading) return null;
	if (!canView) {
		return (
			<AccessDenied rule={ACTION_RULES.viewAuditLog} title="Audit log is for Super Admins" />
		);
	}

	return (
		<div className="space-y-6 rounded-[20px] border border-zinc-100 bg-white p-6 shadow-sm">
			<div>
				<h2 className="text-foreground text-xl font-bold">Audit Log</h2>
				<p className="text-muted-foreground text-sm">
					Every change made by an admin, newest first. Entries can&apos;t be edited or
					deleted.
				</p>
			</div>

			{/* Filters */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
				<div className="space-y-1.5">
					<Label className="text-xs">Admin</Label>
					<Select value={actor} onValueChange={withPageReset(setActor)}>
						<SelectTrigger className="h-10">
							<SelectValue placeholder="All admins" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>All admins</SelectItem>
							{admins.map((admin) => (
								<SelectItem key={admin._id} value={admin._id}>
									{admin.name || admin.email}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs">Action</Label>
					<Select value={action} onValueChange={withPageReset(setAction)}>
						<SelectTrigger className="h-10">
							<SelectValue placeholder="All actions" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>All actions</SelectItem>
							{ACTION_GROUPS.map((group) => (
								<SelectItem key={group.value} value={group.value}>
									{group.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs">Outcome</Label>
					<Select value={outcome} onValueChange={withPageReset(setOutcome)}>
						<SelectTrigger className="h-10">
							<SelectValue placeholder="Any outcome" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>Any outcome</SelectItem>
							<SelectItem value="true">Succeeded</SelectItem>
							<SelectItem value="false">Failed</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs" htmlFor="audit-target">
						Target ID
					</Label>
					<Input
						id="audit-target"
						placeholder="User or order ID"
						value={targetIdInput}
						onChange={(e) => {
							setTargetIdInput(e.target.value);
							setPage(1);
						}}
						className="h-10"
					/>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs" htmlFor="audit-from">
						From
					</Label>
					<Input
						id="audit-from"
						type="date"
						value={from}
						max={to || undefined}
						onChange={(e) => withPageReset(setFrom)(e.target.value)}
						className="h-10"
					/>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs" htmlFor="audit-to">
						To
					</Label>
					<Input
						id="audit-to"
						type="date"
						value={to}
						min={from || undefined}
						onChange={(e) => withPageReset(setTo)(e.target.value)}
						className="h-10"
					/>
				</div>
			</div>
			{hasFilters && (
				<Button variant="ghost" size="sm" onClick={clearFilters} className="-mt-2">
					<Icon icon="ph:x" className="mr-1 size-4" />
					Clear filters
				</Button>
			)}

			{isLoading ? (
				<div className="flex h-64 items-center justify-center">
					<Icon icon="line-md:loading-twotone-loop" className="text-secondary size-10" />
				</div>
			) : error ? (
				<div className="text-destructive flex h-64 items-center justify-center">
					{error.message || "Failed to load the audit log."}
				</div>
			) : (
				<div className={isFetching ? "opacity-60 transition-opacity" : undefined}>
					<DataTable columns={getColumns(columns)} data={data?.data ?? []} title="" />
					<TablePagination
						pagination={data?.pagination}
						onPageChange={setPage}
						isFetching={isFetching}
						itemLabel="entries"
					/>
				</div>
			)}

			{/* Detail drawer */}
			<Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
				<SheetContent className="w-full overflow-y-auto sm:max-w-xl">
					{selected && (
						<>
							<SheetHeader>
								<SheetTitle className="font-mono text-base">
									{selected.action}
								</SheetTitle>
								<SheetDescription>
									{formatTimestamp(selected.createdAt)}
								</SheetDescription>
							</SheetHeader>
							<div className="mt-6">
								<DetailRow label="Admin">
									{actorLabel(selected)}
									{selected.actor?.email ? ` (${selected.actor.email})` : ""}
								</DetailRow>
								<DetailRow label="Role">
									<span className="capitalize">
										{selected.actor?.role ?? selected.actorRole ?? "—"}
									</span>
								</DetailRow>
								<DetailRow label="Outcome">
									<OutcomeBadge entry={selected} />
								</DetailRow>
								<DetailRow label="Request">
									<code className="text-xs">
										{selected.method} {selected.path}
									</code>
								</DetailRow>
								<DetailRow label="Target ID">{selected.targetId ?? "—"}</DetailRow>
								<DetailRow label="IP address">{selected.ip ?? "—"}</DetailRow>
								{selected.userAgent && (
									<DetailRow label="User agent">
										<span className="text-xs font-normal">
											{selected.userAgent}
										</span>
									</DetailRow>
								)}
							</div>
							<div className="mt-6 space-y-2">
								<h3 className="text-foreground text-sm font-semibold">
									Request body
								</h3>
								<p className="text-muted-foreground text-xs">
									Passwords, tokens and other secrets are redacted before the
									entry is saved.
								</p>
								<pre className="max-h-[50vh] overflow-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-100">
									{selected.body === undefined || selected.body === null
										? "(no body)"
										: JSON.stringify(selected.body, null, 2)}
								</pre>
							</div>
						</>
					)}
				</SheetContent>
			</Sheet>
		</div>
	);
}

/* eslint-enable */
