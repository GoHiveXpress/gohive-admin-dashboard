// src/hooks/usePermissions.ts
// The logged-in admin's role and staff permissions. Role comes from the session
// straight away; staffPermissions come from GET /admin/profile, which is also
// the authority on role once it has loaded.

"use client";

import { useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useAdminProfile } from "@/hooks/userManagement";
import {
	hasPermission,
	satisfiesRule,
	type Permission,
	type PermissionRule,
	type PermissionSubject,
} from "@/lib/permissions";

// eslint-disable-next-line import/prefer-default-export
export function usePermissions() {
	const { data: session, status } = useSession();
	const { data: profileResponse, isLoading: profileLoading, isError } = useAdminProfile();
	const profile = profileResponse?.data;

	const subject = useMemo<PermissionSubject>(
		() => ({
			role: profile?.role ?? session?.user?.role,
			staffPermissions: profile?.staffPermissions ?? [],
		}),
		[profile?.role, profile?.staffPermissions, session?.user?.role],
	);

	// A superadmin session can render right away. Staff have to wait for the
	// profile, otherwise gated screens would flash "no access" first.
	const isLoading =
		status === "loading" ||
		(subject.role !== "superadmin" && profileLoading && !isError && !profile);

	const can = useCallback(
		(permission: Permission) => hasPermission(subject, permission),
		[subject],
	);
	const allows = useCallback((rule?: PermissionRule) => satisfiesRule(subject, rule), [subject]);

	return {
		role: subject.role,
		staffPermissions: subject.staffPermissions ?? [],
		isSuperAdmin: subject.role === "superadmin",
		isLoading,
		can,
		allows,
	};
}
