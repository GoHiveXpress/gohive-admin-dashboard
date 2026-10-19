// src/components/PermissionGate/index.tsx
// Renders children only when the logged-in admin satisfies `rule`.

"use client";

import { type ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { type PermissionRule } from "@/lib/permissions";

interface PermissionGateProps {
	rule?: PermissionRule;
	fallback?: ReactNode;
	children: ReactNode;
}

export default function PermissionGate({
	rule,
	fallback = null,
	children,
}: PermissionGateProps): ReactNode {
	const { allows, isLoading } = usePermissions();
	return isLoading || !allows(rule) ? fallback : children;
}
