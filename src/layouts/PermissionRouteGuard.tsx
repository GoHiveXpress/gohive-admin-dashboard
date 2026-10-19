// src/layouts/PermissionRouteGuard.tsx
// Shows an access-denied screen instead of a gated page the admin can't use,
// so opening the URL directly doesn't land on a page full of 403s.

"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import AccessDenied from "@/components/_atoms/AccessDenied";
import { usePermissions } from "@/hooks/usePermissions";
import { ruleForPath } from "@/lib/permissions";

export default function PermissionRouteGuard({ children }: { children: ReactNode }): ReactNode {
	const pathname = usePathname();
	const { allows, isLoading } = usePermissions();
	const rule = ruleForPath(pathname);

	if (!rule) return children;

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Icon icon="line-md:loading-twotone-loop" className="text-secondary size-10" />
			</div>
		);
	}

	if (!allows(rule)) return <AccessDenied rule={rule} />;

	return children;
}
