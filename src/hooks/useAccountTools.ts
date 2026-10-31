// src/hooks/useAccountTools.ts
// Phase 9 admin tools: customer account actions, vendor store controls and
// admin sign-in sessions.

"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import { accountToolsApi } from "@/services/accountTools";
import { type OperatingHours } from "@/types/vendorManagement";
import { setAuthToken } from "@/utils/auth";

const useToastingMutation = <TVars, TData extends { message?: string }>(
	mutationFn: (vars: TVars) => Promise<TData>,
	invalidate: (vars: TVars) => readonly (readonly unknown[])[],
	fallbackMessage: string,
) => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn,
		onSuccess: (data, vars) => {
			toast.success(data.message ?? fallbackMessage);
			invalidate(vars).forEach((queryKey) => {
				queryClient.invalidateQueries({ queryKey }).catch(() => undefined);
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

// --- Customers ---

export const useCustomerWallet = (id: string, page: number) =>
	useQuery({
		queryKey: ["customer_wallet", id, page],
		queryFn: () => accountToolsApi.getCustomerWallet(id, page),
		enabled: !!id,
		placeholderData: keepPreviousData,
	});

export const useCustomerNotes = (id: string) =>
	useQuery({
		queryKey: ["customer_notes", id],
		queryFn: () => accountToolsApi.getCustomerNotes(id),
		enabled: !!id,
	});

export const useAddCustomerNote = (id: string) =>
	useToastingMutation(
		(text: string) => accountToolsApi.addCustomerNote(id, text),
		() => [["customer_notes", id]],
		"Note added",
	);

export const useSignOutCustomer = () =>
	useToastingMutation(
		(id: string) => accountToolsApi.signOutCustomer(id),
		() => [],
		"Signed out everywhere",
	);

export const useResetCustomerPassword = () =>
	useToastingMutation(
		(id: string) => accountToolsApi.resetCustomerPassword(id),
		() => [],
		"Reset code sent",
	);

export const useDeleteCustomer = () =>
	useToastingMutation(
		({ id, reason }: { id: string; reason: string }) =>
			accountToolsApi.deleteCustomer(id, reason),
		() => [["customer"], ["customers"]],
		"Customer deleted",
	);

export const useExportCustomer = () => {
	const toast = useToast();
	return useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const blob = await accountToolsApi.exportCustomerData(id);
			const url = URL.createObjectURL(new Blob([blob], { type: "application/json" }));
			const link = document.createElement("a");
			link.href = url;
			link.download = `gohive-customer-${name.replace(/[^\w-]+/g, "-").toLowerCase()}-${id}.json`;
			link.click();
			URL.revokeObjectURL(url);
		},
		onSuccess: () => toast.success("Export downloaded"),
		onError: (error: Error) => toast.error(error.message),
	});
};

// --- Vendors ---

const VENDOR_KEYS = [["vendor"], ["vendors"]] as const;

export const useCloseVendor = (id: string) =>
	useToastingMutation(
		(payload: { reason: string; hours?: number }) => accountToolsApi.closeVendor(id, payload),
		() => VENDOR_KEYS,
		"Store closed",
	);

export const useReopenVendor = (id: string) =>
	useToastingMutation(
		() => accountToolsApi.reopenVendor(id),
		() => VENDOR_KEYS,
		"Store reopened",
	);

export const useUpdateVendorHours = (id: string) =>
	useToastingMutation(
		(hours: OperatingHours[]) => accountToolsApi.updateVendorHours(id, hours),
		() => VENDOR_KEYS,
		"Opening hours saved",
	);

export const useUpdateVendorCommission = (id: string) =>
	useToastingMutation(
		(percent: number) => accountToolsApi.updateVendorCommission(id, percent),
		() => VENDOR_KEYS,
		"Commission saved",
	);

export const useSetMenuItemVisibility = (vendorId: string) =>
	useToastingMutation(
		({ itemId, hidden, reason }: { itemId: string; hidden: boolean; reason?: string }) =>
			accountToolsApi.setMenuItemVisibility(vendorId, itemId, { hidden, reason }),
		() => [["vendorMenu", vendorId]],
		"Item updated",
	);

// --- Admin sessions ---

const MY_SESSIONS_KEY = ["admin_sessions", "me"];

export const useMySessions = () =>
	useQuery({
		queryKey: MY_SESSIONS_KEY,
		queryFn: () => accountToolsApi.getMySessions(),
	});

export const useRevokeMySession = () =>
	useToastingMutation(
		(id: string) => accountToolsApi.revokeMySession(id),
		() => [MY_SESSIONS_KEY],
		"Device signed out",
	);

// The backend bumps the token version, so this browser gets a fresh token
// back and has to keep it, or the next request signs it out too.
export const useSignOutOtherSessions = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	const { update } = useSession();
	return useMutation({
		mutationFn: () => accountToolsApi.signOutOtherSessions(),
		onSuccess: async (data) => {
			if (data.token) {
				await update({ backendToken: data.token });
				setAuthToken(data.token, { markActive: false });
			}
			queryClient.setQueryData(MY_SESSIONS_KEY, { success: true, data: data.data });
			toast.success(data.message ?? "Signed out of other devices");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useAdminSessions = (adminId: string) =>
	useQuery({
		queryKey: ["admin_sessions", adminId],
		queryFn: () => accountToolsApi.getAdminSessions(adminId),
		enabled: !!adminId,
	});

export const useSignOutAdminEverywhere = () =>
	useToastingMutation(
		(adminId: string) => accountToolsApi.signOutAdminEverywhere(adminId),
		(adminId) => [["admin_sessions", adminId]],
		"Signed out everywhere",
	);
