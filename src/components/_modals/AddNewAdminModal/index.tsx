"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useInviteStaff } from "@/hooks/userManagement";

interface AddNewAdminModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function AddNewAdminModal({
	isOpen,
	onClose,
}: AddNewAdminModalProps) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("staff");
	const inviteMutation = useInviteStaff();

	const handleInvite = () => {
		inviteMutation.mutate(
			{ email, role },
			{
				onSuccess: () => {
					setEmail("");
					setRole("staff");
					onClose();
				},
			},
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px] rounded-[24px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Invite New Admin</DialogTitle>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Email Address</label>
						<Input
							placeholder="admin@gohive.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="h-12 rounded-xl"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Assign Role</label>
						<Select value={role} onValueChange={setRole}>
							<SelectTrigger className="h-12 rounded-xl">
								<SelectValue placeholder="Select Role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="superadmin">Super Admin</SelectItem>
								<SelectItem value="staff">Staff</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button
						onClick={handleInvite}
						disabled={inviteMutation.isPending || !email}
						className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-base font-medium"
					>
						{inviteMutation.isPending ? "Sending Invitation..." : "Send Invitation"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
