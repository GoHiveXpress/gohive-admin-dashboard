"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import FloatingInput from "@/components/FormElements/FloatingInput";
import FloatingSelect from "@/components/FormElements/FloatingSelect";
import { SelectItem } from "@/components/ui/select";
import { type StaffData } from "../../Vendor/VendorDetails/ProfileManagement/StaffProfile";

interface EditStaffProps {
	staff: StaffData;
}

export default function EditStaffProfileModal({ staff }: EditStaffProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="text-muted-foreground hover:text-foreground transition-colors">
					<Icon icon="ph:pencil-simple-bold" width="20" />
				</button>
			</DialogTrigger>
			<DialogContent className="overflow-hidden rounded-[24px] bg-[#FAFAF9] p-0 sm:max-w-[800px]">
				<DialogHeader className="border-border/50 border-b bg-white p-6">
					<DialogTitle className="text-xl font-semibold">Staff Profile</DialogTitle>
				</DialogHeader>

				<div className="m-6 grid grid-cols-1 gap-6 rounded-[20px] bg-white p-8 md:grid-cols-2">
					<FloatingInput
						label="Full Name"
						defaultValue={staff.name}
						icon="ph:user-fill"
					/>
					<FloatingSelect
						label="Role Assigned"
						defaultValue={staff.role === "Manager" ? "manager" : "kitchen"}
						icon="ph:user-gear-fill"
					>
						<SelectItem value="manager">Manager</SelectItem>
						<SelectItem value="kitchen">Kitchen Assistant</SelectItem>
						<SelectItem value="waiter">Waiter</SelectItem>
					</FloatingSelect>

					<FloatingInput
						label="Email"
						type="email"
						defaultValue={staff.email}
						icon="ph:envelope-simple-fill"
					/>

					<FloatingInput
						label="Passport Phot"
						readOnly
						icon="ph:upload-simple-bold"
						placeholder="Upload"
					/>

					<FloatingInput
						label="Phone Number"
						defaultValue="09056113019"
						icon="ph:phone-fill"
					/>

					<Button className="bg-secondary hover:bg-secondary/90 flex h-14 w-full items-center justify-center gap-2 rounded-xl font-medium text-white">
						<Icon icon="ph:key-fill" className="size-5" />
						Set Permissions
					</Button>
				</div>

				<DialogFooter className="border-border/50 gap-4 border-t bg-white p-6">
					<DialogClose asChild>
						<Button
							variant="outline"
							className="text-muted-foreground h-12 flex-1 rounded-xl border-none bg-[#E6E8E6] hover:bg-[#dcdedc]"
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="submit"
						className="bg-secondary hover:bg-secondary/90 h-12 flex-1 rounded-xl text-white"
					>
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
