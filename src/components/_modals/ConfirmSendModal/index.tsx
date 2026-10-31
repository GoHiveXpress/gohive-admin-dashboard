// src/components/_modals/ConfirmSendModal/index.tsx

"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAudienceCount } from "@/hooks/communication";

const ROLE_LABELS: Record<string, [string, string]> = {
	customer: ["customer", "customers"],
	vendor: ["vendor", "vendors"],
	rider: ["rider", "riders"],
};

const plural = (count: number, role: string) => {
	const [one, many] = ROLE_LABELS[role] ?? [role, `${role}s`];
	return `${count.toLocaleString()} ${count === 1 ? one : many}`;
};

interface ConfirmSendModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	type: "broadcast" | "campaign-email" | "campaign-sms";
	roles: string[];
	subject: string;
	// ISO time when it's scheduled rather than sent now
	scheduledAt?: string;
	isLoading?: boolean;
}

// Mass sends can't be recalled, so show who they reach before they go
export default function ConfirmSendModal({
	isOpen,
	onOpenChange,
	onConfirm,
	type,
	roles,
	subject,
	scheduledAt,
	isLoading = false,
}: ConfirmSendModalProps) {
	const when = scheduledAt
		? new Date(scheduledAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
		: null;
	const expandedRoles = roles.includes("all") ? ["customer", "vendor", "rider"] : roles;
	const {
		data,
		isLoading: isCounting,
		isError,
		refetch,
	} = useAudienceCount(type, expandedRoles, isOpen);
	const total = data?.data.total;
	const byRole = data?.data.byRole ?? {};
	const channel = type === "campaign-email" ? "email" : "push notification";

	let summary: React.ReactNode;
	if (isCounting) {
		summary = (
			<span className="text-muted-foreground flex items-center gap-2">
				<Icon icon="line-md:loading-twotone-loop" className="size-4" /> Counting recipients…
			</span>
		);
	} else if (isError || total === undefined) {
		summary = (
			<span className="text-destructive">
				Couldn&apos;t count recipients.{" "}
				<button type="button" className="underline" onClick={() => refetch()}>
					Try again
				</button>
			</span>
		);
	} else {
		summary = (
			<>
				<span className="text-foreground text-2xl font-bold">{total.toLocaleString()}</span>{" "}
				<span className="text-muted-foreground">
					{total === 1 ? "person" : "people"}{" "}
					{when
						? `would get this ${channel} if it went out now`
						: `will get this ${channel}`}
				</span>
				<span className="text-muted-foreground mt-1 block text-xs">
					{Object.entries(byRole)
						.map(([role, count]) => plural(count, role))
						.join(" · ")}
					. Suspended accounts are skipped.
				</span>
			</>
		);
	}

	const canSend = !isCounting && !isError && (total ?? 0) > 0;
	const verb = when ? "Schedule" : "Send";

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
			<DialogContent className="overflow-hidden rounded-[24px] border-none p-0 shadow-2xl sm:max-w-[440px]">
				<div className="bg-secondary/10 flex h-20 items-center px-6">
					<div className="bg-secondary flex size-10 items-center justify-center rounded-xl shadow-lg">
						<Icon icon="ph:paper-plane-tilt-bold" className="size-6 text-white" />
					</div>
					<DialogHeader className="ml-4 p-0 text-left">
						<DialogTitle className="text-lg font-bold text-[#17110A]">
							{when ? "Schedule it?" : "Send now?"}
						</DialogTitle>
					</DialogHeader>
				</div>

				<div className="space-y-4 p-6">
					<DialogDescription asChild>
						<div className="space-y-3 text-sm leading-relaxed">
							<p className="text-muted-foreground">
								&ldquo;
								<span className="text-foreground font-medium">{subject}</span>
								&rdquo;{" "}
								{when ? (
									<>
										goes out on{" "}
										<span className="text-foreground font-medium">{when}</span>.
										You can cancel it until then.
									</>
								) : (
									<>goes out straight away and can&apos;t be recalled.</>
								)}
							</p>
							<div className="rounded-xl bg-gray-50 p-4" aria-live="polite">
								{summary}
							</div>
						</div>
					</DialogDescription>

					<div className="flex items-center gap-3 pt-2">
						<Button
							type="button"
							variant="ghost"
							className="text-muted-foreground h-11 flex-1 rounded-xl font-bold hover:bg-gray-100"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="bg-secondary hover:bg-secondary/90 h-11 flex-[1.5] rounded-xl font-bold text-white"
							onClick={onConfirm}
							disabled={isLoading || !canSend}
						>
							{isLoading && (
								<Icon icon="line-md:loading-twotone-loop" className="mr-2 size-5" />
							)}
							{total !== undefined && canSend
								? `${verb} to ${total.toLocaleString()}`
								: verb}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
