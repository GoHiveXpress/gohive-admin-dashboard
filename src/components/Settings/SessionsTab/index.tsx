"use client";

// Where admins are signed in. Everyone sees their own devices; a superadmin can
// also look at another admin's and sign them out everywhere.

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmActionModal from "@/components/_modals/ConfirmActionModal";
import {
	useAdminSessions,
	useMySessions,
	useRevokeMySession,
	useSignOutAdminEverywhere,
	useSignOutOtherSessions,
} from "@/hooks/useAccountTools";
import { usePermissions } from "@/hooks/usePermissions";
import { useAdmins } from "@/hooks/userManagement";
import { type AdminSession } from "@/types/accountTools";

const formatDate = (value: string) =>
	new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });

function SessionList({
	sessions,
	isLoading,
	onRevoke,
	revoking,
}: {
	sessions: AdminSession[];
	isLoading: boolean;
	onRevoke?: (id: string) => void;
	revoking?: boolean;
}) {
	if (isLoading) return <Skeleton className="h-28 w-full rounded-xl" />;
	if (sessions.length === 0) {
		return (
			<p className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
				No active sessions.
			</p>
		);
	}
	return (
		<ul className="divide-y rounded-xl border bg-white">
			{sessions.map((session) => (
				<li key={session._id} className="flex flex-wrap items-center gap-3 p-4">
					<Icon icon="ph:desktop" className="text-muted-foreground size-6 shrink-0" />
					<div className="min-w-0 flex-1 space-y-0.5">
						<p className="flex items-center gap-2 text-sm font-medium">
							{session.device}
							{session.current && (
								<Badge className="rounded-full border-none bg-green-50 text-green-700 shadow-none">
									This browser
								</Badge>
							)}
						</p>
						<p className="text-muted-foreground text-xs">
							{session.ip ?? "Unknown IP"} · Signed in{" "}
							{formatDate(session.signedInAt)} · Last seen{" "}
							{formatDate(session.lastSeenAt)}
						</p>
					</div>
					{onRevoke && !session.current && (
						<Button
							size="sm"
							variant="outline"
							disabled={revoking}
							onClick={() => onRevoke(session._id)}
						>
							Sign out
						</Button>
					)}
				</li>
			))}
		</ul>
	);
}

function OtherAdminSessions() {
	const { data: adminsResponse } = useAdmins();
	const admins = adminsResponse?.data ?? [];
	const [adminId, setAdminId] = useState("");
	const [confirming, setConfirming] = useState(false);
	const { data, isLoading } = useAdminSessions(adminId);
	const signOutEverywhere = useSignOutAdminEverywhere();
	const selected = admins.find((a) => a._id === adminId);
	const selectedName = [selected?.name, selected?.email].find(Boolean) ?? "this admin";

	return (
		<section className="space-y-4">
			<div>
				<h3 className="text-lg font-medium">Other admins</h3>
				<p className="text-muted-foreground text-sm">
					Use this when a laptop is lost or someone leaves the team.
				</p>
			</div>
			<div className="flex flex-wrap items-end gap-3">
				<div className="w-full max-w-xs space-y-1.5">
					<Label className="text-xs">Admin</Label>
					<Select value={adminId} onValueChange={setAdminId}>
						<SelectTrigger className="h-10">
							<SelectValue placeholder="Pick an admin" />
						</SelectTrigger>
						<SelectContent>
							{admins.map((admin) => (
								<SelectItem key={admin._id} value={admin._id}>
									{admin.name || admin.email}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{adminId && (
					<Button
						variant="destructive"
						disabled={signOutEverywhere.isPending}
						onClick={() => setConfirming(true)}
					>
						Sign out everywhere
					</Button>
				)}
			</div>
			{adminId && <SessionList sessions={data?.data ?? []} isLoading={isLoading} />}

			<ConfirmActionModal
				isOpen={confirming}
				onOpenChange={setConfirming}
				title={`Sign ${selectedName} out everywhere?`}
				description="Every device they're signed in on stops working at once. They can sign in again with their password."
				confirmLabel="Sign out everywhere"
				tone="danger"
				isLoading={signOutEverywhere.isPending}
				onConfirm={() => {
					signOutEverywhere
						.mutateAsync(adminId)
						.then(() => setConfirming(false))
						.catch(() => undefined);
				}}
			/>
		</section>
	);
}

export default function SessionsTab() {
	const { isSuperAdmin } = usePermissions();
	const { data, isLoading, error } = useMySessions();
	const revoke = useRevokeMySession();
	const signOutOthers = useSignOutOtherSessions();
	const [confirming, setConfirming] = useState(false);
	const sessions = data?.data ?? [];
	const hasOthers = sessions.some((s) => !s.current);

	return (
		<div className="space-y-10">
			<section className="space-y-4">
				<div className="flex flex-wrap items-end justify-between gap-3">
					<div>
						<h2 className="text-2xl font-medium">Your sessions</h2>
						<p className="text-muted-foreground text-sm">
							Devices signed in to your account.
						</p>
					</div>
					<Button
						variant="outline"
						disabled={!hasOthers || signOutOthers.isPending}
						onClick={() => setConfirming(true)}
					>
						Sign out other devices
					</Button>
				</div>
				{error && <p className="text-destructive text-sm">Failed to load sessions.</p>}
				<SessionList
					sessions={sessions}
					isLoading={isLoading}
					onRevoke={(id) => revoke.mutate(id)}
					revoking={revoke.isPending}
				/>
			</section>

			{isSuperAdmin && <OtherAdminSessions />}

			<ConfirmActionModal
				isOpen={confirming}
				onOpenChange={setConfirming}
				title="Sign out your other devices?"
				description="You stay signed in here. Every other device needs your password again."
				confirmLabel="Sign them out"
				tone="danger"
				isLoading={signOutOthers.isPending}
				onConfirm={() => {
					signOutOthers
						.mutateAsync()
						.then(() => setConfirming(false))
						.catch(() => undefined);
				}}
			/>
		</div>
	);
}
