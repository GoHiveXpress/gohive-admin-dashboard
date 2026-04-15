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

export default function AddNewStaffModal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="bg-secondary hover:bg-secondary/90 gap-2 rounded-full px-6 text-white">
					<Icon icon="ph:plus-circle" className="size-5" />
					Add New Staff
				</Button>
			</DialogTrigger>
			<DialogContent className="overflow-hidden rounded-[24px] bg-[#FAFAF9] p-0 sm:max-w-[800px]">
				<DialogHeader className="border-border/50 border-b bg-white p-6">
					<DialogTitle className="text-xl font-semibold">Add New Staff</DialogTitle>
				</DialogHeader>

				<div className="m-6 grid grid-cols-1 gap-6 rounded-[20px] bg-white p-8 md:grid-cols-2">
					<FloatingInput label="Full Name" placeholder="Enter name" icon="ph:user-fill" />
					<FloatingSelect
						label="Role Assigned"
						placeholder="Manager"
						icon="ph:user-gear-fill"
					>
						<SelectItem value="manager">Manager</SelectItem>
						<SelectItem value="kitchen">Kitchen Assistant</SelectItem>
						<SelectItem value="waiter">Waiter</SelectItem>
					</FloatingSelect>

					<FloatingInput
						label="Email"
						type="email"
						placeholder="Enter email"
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
						icon="ph:phone-fill"
						placeholder="Enter phone"
					/>

					{/* Set Permissions Button Mock */}
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
						Add Staff
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
