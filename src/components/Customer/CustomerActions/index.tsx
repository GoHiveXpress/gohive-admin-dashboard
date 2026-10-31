// src/components/Customer/CustomerActions/index.tsx
// Account actions on a customer's profile: suspend or reactivate, sign out
// everywhere, reset password, export their data, delete (NDPR).

"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmActionModal from "@/components/_modals/ConfirmActionModal";
import ConfirmReasonModal from "@/components/_modals/ConfirmReasonModal";
import { ROUTES } from "@/constants/routes";
import {
	useDeleteCustomer,
	useExportCustomer,
	useResetCustomerPassword,
	useSignOutCustomer,
} from "@/hooks/useAccountTools";
import { usePermissions } from "@/hooks/usePermissions";
import { useUpdateAccountStatus } from "@/hooks/userManagement";
import { ACTION_RULES } from "@/lib/permissions";
import { type Customer } from "@/types/customerManagement";

type Dialog = "suspend" | "reactivate" | "signOut" | "reset" | "delete" | null;

export default function CustomerActions({ customer }: { customer: Customer }) {
	const router = useRouter();
	const { allows } = usePermissions();
	const [dialog, setDialog] = useState<Dialog>(null);
	const close = () => setDialog(null);

	const updateStatus = useUpdateAccountStatus();
	const signOut = useSignOutCustomer();
	const reset = useResetCustomerPassword();
	const exportData = useExportCustomer();
	const remove = useDeleteCustomer();

	const canEditStatus = allows(ACTION_RULES.updateAccountStatus);
	const canManage = allows(ACTION_RULES.manageCustomerAccount);
	const canExport = allows(ACTION_RULES.exportCustomerData);
	const canDelete = allows(ACTION_RULES.deleteCustomer);

	if (customer.accountStatus === "Deleted") return null;
	if (!canEditStatus && !canManage && !canExport && !canDelete) return null;

	const isSuspended = customer.accountStatus === "Suspend";
	const run = (promise: Promise<unknown>) => {
		promise.then(close).catch(() => undefined);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="rounded-full">
						<Icon icon="ph:dots-three-outline-fill" className="mr-2 size-4" />
						Actions
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-60">
					{canEditStatus && (
						<DropdownMenuItem
							onSelect={() => setDialog(isSuspended ? "reactivate" : "suspend")}
						>
							<Icon
								icon={isSuspended ? "ph:play-circle" : "ph:pause-circle"}
								className="mr-2 size-4"
							/>
							{isSuspended ? "Reactivate account" : "Suspend account"}
						</DropdownMenuItem>
					)}
					{canManage && (
						<>
							<DropdownMenuItem onSelect={() => setDialog("signOut")}>
								<Icon icon="ph:sign-out" className="mr-2 size-4" />
								Sign out everywhere
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setDialog("reset")}>
								<Icon icon="ph:key" className="mr-2 size-4" />
								Reset password
							</DropdownMenuItem>
						</>
					)}
					{canExport && (
						<DropdownMenuItem
							disabled={exportData.isPending}
							onSelect={() =>
								exportData.mutate({ id: customer._id, name: customer.name })
							}
						>
							<Icon icon="ph:download-simple" className="mr-2 size-4" />
							{exportData.isPending ? "Preparing export…" : "Export data (NDPR)"}
						</DropdownMenuItem>
					)}
					{canDelete && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onSelect={() => setDialog("delete")}
							>
								<Icon icon="ph:trash" className="mr-2 size-4" />
								Delete personal data
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmReasonModal
				isOpen={dialog === "suspend" || dialog === "reactivate"}
				onOpenChange={(open) => !open && close()}
				title={isSuspended ? "Reactivate this account?" : "Suspend this account?"}
				description={
					isSuspended
						? `${customer.name} will be able to sign in and order again.`
						: `${customer.name} is signed out and can't sign in or order until reactivated.`
				}
				confirmLabel={isSuspended ? "Reactivate" : "Suspend"}
				tone={isSuspended ? "success" : "danger"}
				reasonRequired={!isSuspended}
				isLoading={updateStatus.isPending}
				onConfirm={(reason) =>
					run(
						updateStatus.mutateAsync({
							userId: customer._id,
							status: isSuspended ? "Active" : "Suspend",
							reason,
						}),
					)
				}
			/>

			<ConfirmActionModal
				isOpen={dialog === "signOut"}
				onOpenChange={(open) => !open && close()}
				title="Sign out everywhere?"
				description={`Every device ${customer.name} is signed in on will be signed out. They can sign back in with their password.`}
				confirmLabel="Sign out"
				isLoading={signOut.isPending}
				onConfirm={() => run(signOut.mutateAsync(customer._id))}
			/>

			<ConfirmActionModal
				isOpen={dialog === "reset"}
				onOpenChange={(open) => !open && close()}
				title="Reset their password?"
				description={`Their current password stops working and they're signed out. We email a reset code to ${customer.email}.`}
				confirmLabel="Reset password"
				tone="danger"
				isLoading={reset.isPending}
				onConfirm={() => run(reset.mutateAsync(customer._id))}
			/>

			<ConfirmReasonModal
				isOpen={dialog === "delete"}
				onOpenChange={(open) => !open && close()}
				title="Delete this customer's personal data?"
				description="Their name, email, phone, addresses and saved cards are wiped and they can't sign in again. Order and payment records stay, without their details. This can't be undone. It's refused while they have money in their wallet or orders in progress."
				confirmLabel="Delete for good"
				placeholder="Why, e.g. the customer's NDPR erasure request and its date."
				isLoading={remove.isPending}
				onConfirm={(reason) =>
					run(
						remove
							.mutateAsync({ id: customer._id, reason })
							.then(() => router.push(ROUTES.CUSTOMERS)),
					)
				}
			/>
		</>
	);
}
