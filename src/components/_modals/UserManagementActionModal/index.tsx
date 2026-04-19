// src/components/_modals/UserManagementActionModal/index.tsx
/* eslint-disable import/no-extraneous-dependencies, no-console, react/no-array-index-key, react/no-unused-prop-types */

"use client";

import React from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { 
	useUpdateUserRole, 
	useUpdateAccountStatus,
	useCustomer,
	useVendor,
	useRider
} from "@/hooks/userManagement";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type UserType = "customer" | "vendor" | "rider" | "admin";

interface UserManagementActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	userType: UserType;
	userId: string;
}

export default function UserManagementActionModal({
	isOpen,
	onClose,
	userType,
	userId,
}: UserManagementActionModalProps) {
	const router = useRouter();
	const updateRole = useUpdateUserRole();
	const updateStatus = useUpdateAccountStatus();

	// Fetch current user data to determine status
	const { data: customerData, isLoading: loadingCustomer } = useCustomer(userId, userType === "customer" && isOpen);
	const { data: vendorData, isLoading: loadingVendor } = useVendor(userId, userType === "vendor" && isOpen);
	const { data: riderData, isLoading: loadingRider } = useRider(userId, userType === "rider" && isOpen);

	const isLoading = loadingCustomer || loadingVendor || loadingRider;
	const userData = customerData?.data || vendorData?.data || riderData?.data;
	const currentStatus = userData?.accountStatus;

	const handleAction = async (action: string) => {
		try {
			if (action.includes("Suspend")) {
				await updateStatus.mutateAsync({ userId, status: "Suspend" });
				toast.success("Account suspended successfully");
			} else if (action.includes("Reactivate")) {
				await updateStatus.mutateAsync({ userId, status: "Active" });
				toast.success("Account reactivated successfully");
			} else if (action.includes("Admin Role") || action.includes("Update role to Admin")) {
				await updateRole.mutateAsync({ userId, newRole: "superadmin" });
				toast.success("User promoted to Admin");
			} else if (action === "Remove Admin") {
				await updateRole.mutateAsync({ userId, newRole: "customer" });
				toast.success("Admin role removed");
			} else if (action.includes("Send message") || action.includes("View complaint")) {
				router.push("/support");
			} else if (action === "View store details") {
				router.push(`/vendor-management/${userId}`);
			} else if (action === "View route logs") {
				router.push(`/rider-management/${userId}`);
			}
			onClose();
		} catch (error: any) {
			toast.error(error.message || "Action failed");
		}
	};


	const getActionsConfig = () => {
		const isSuspended = currentStatus === "Suspend" || currentStatus === "Inactive";
		
		switch (userType) {
			case "customer":
				return [
					{ label: "Suspend Account", icon: "ph:pause-circle-bold", type: "danger", hidden: isSuspended },
					{ label: "Reactivate Account", icon: "ph:play-circle-bold", type: "success", hidden: !isSuspended },
					{ label: "Send message or campaign", icon: "ph:paper-plane-tilt-bold", hidden: false },
					{ label: "View complaint resolution status", icon: "ph:file-search-bold", hidden: false },
					{ label: "Update role to Admin", icon: "ph:shield-user-bold", hidden: false },
				];
			case "vendor":
				return [
					{ label: "Suspend Vendor", icon: "ph:storefront-bold", type: "danger", hidden: isSuspended },
					{ label: "Reactivate Vendor", icon: "ph:storefront-bold", type: "success", hidden: !isSuspended },
					{ label: "View store details", icon: "ph:eye-bold", hidden: false },
					{ label: "View complaint resolution status", icon: "ph:file-search-bold", hidden: false },
				];
			case "rider":
				return [
					{ label: "Suspend Rider", icon: "ph:bicycle-bold", type: "danger", hidden: isSuspended },
					{ label: "Reactivate Rider", icon: "ph:bicycle-bold", type: "success", hidden: !isSuspended },
					{ label: "View complaint resolution status", icon: "ph:file-search-bold", hidden: false },
					{ label: "View route logs", icon: "ph:map-trifold-bold", hidden: false },
				];
			case "admin":
				return [
					{ label: "Remove Admin", icon: "ph:user-minus-bold", type: "danger", hidden: false }
				];
			default:
				return [];
		}
	};

	const actions = getActionsConfig().filter(a => !a.hidden);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="gap-6 rounded-[32px] border-none bg-white/90 p-8 shadow-2xl backdrop-blur-xl sm:max-w-[420px] [&>button]:hidden">
				<VisuallyHidden>
					<DialogTitle>User Actions</DialogTitle>
				</VisuallyHidden>

				{/* Header */}
				<div className="flex items-start justify-between">
					<motion.div 
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="bg-primary/10 flex size-12 items-center justify-center rounded-2xl shadow-inner"
					>
						<Icon icon="ph:user-circle-fill" className="text-primary size-7" />
					</motion.div>
					<DialogClose asChild>
						<Button
							variant="ghost"
							size="icon"
							className="bg-muted/30 hover:bg-muted/50 size-10 rounded-full transition-colors"
						>
							<Icon icon="ph:x" className="text-foreground size-5" />
						</Button>
					</DialogClose>
				</div>

				<div className="space-y-1">
					<h3 className="text-foreground text-xl font-bold tracking-tight">Manage Account</h3>
					<p className="text-muted-foreground text-sm">Select an action to perform for this user.</p>
				</div>

				{/* Dynamic Buttons */}
				<div className="flex flex-col gap-3">
					<AnimatePresence mode="wait">
						{isLoading ? (
							<div className="flex h-32 items-center justify-center">
								<Loader2 className="text-primary size-8 animate-spin" />
							</div>
						) : (
							<motion.div 
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex flex-col gap-3"
							>
								{actions.map((action, index) => (
									<motion.button
										key={action.label}
										whileHover={{ 
											scale: 1.02,
											backgroundColor: action.type === "danger" ? "rgba(239, 68, 68, 0.05)" : action.type === "success" ? "rgba(34, 197, 94, 0.05)" : "rgba(253, 185, 0, 0.05)",
											borderColor: action.type === "danger" ? "rgba(239, 68, 68, 0.3)" : action.type === "success" ? "rgba(34, 197, 94, 0.3)" : "rgba(253, 185, 0, 0.3)"
										}}
										whileTap={{ scale: 0.98 }}
										className={cn(
											"border-border text-foreground flex h-14 w-full items-center justify-between rounded-2xl border bg-white/50 px-5 text-left text-base font-semibold transition-all duration-200",
											action.type === "danger" && "hover:text-destructive",
											action.type === "success" && "hover:text-green-600"
										)}
										onClick={() => handleAction(action.label)}
									>
										<div className="flex items-center gap-3">
											<Icon icon={action.icon as string} className="size-5 opacity-60" />
											<span>{action.label}</span>
										</div>
										<Icon icon="ph:caret-right-bold" className="text-muted-foreground/50 size-4" />
									</motion.button>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/* eslint-enable */
