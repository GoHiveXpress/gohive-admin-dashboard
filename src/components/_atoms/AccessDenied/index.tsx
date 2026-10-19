// src/components/_atoms/AccessDenied/index.tsx

"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { describeRule, type PermissionRule } from "@/lib/permissions";

interface AccessDeniedProps {
	rule?: PermissionRule;
	title?: string;
	compact?: boolean;
}

export default function AccessDenied({
	rule,
	title = "You don't have access to this page",
	compact = false,
}: AccessDeniedProps) {
	const needed = rule ? describeRule(rule) : "";

	return (
		<div
			className={
				compact
					? "flex flex-col items-center justify-center gap-3 p-8 text-center"
					: "flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-100 bg-white p-10 text-center shadow-sm"
			}
		>
			<div className="bg-muted flex size-14 items-center justify-center rounded-full">
				<Icon icon="ph:lock-key-bold" className="text-muted-foreground size-7" />
			</div>
			<h2 className="text-foreground text-xl font-bold">{title}</h2>
			<p className="text-muted-foreground max-w-md text-sm">
				{needed
					? `This needs the ${needed} permission. Ask a Super Admin to grant it in Settings → Role Management.`
					: "Ask a Super Admin to grant you access in Settings → Role Management."}
			</p>
			{!compact && (
				<Button asChild variant="outline" className="mt-2">
					<Link href={ROUTES.DASHBOARD}>Back to dashboard</Link>
				</Button>
			)}
		</div>
	);
}
