"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, no-use-before-define */

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddExtraModal from "@/components/_modals/AddExtraModal";

export default function AddExtraList() {
	return (
		<div className="space-y-4">
			{/* Extra Item 1 */}
			<ExtraItemRow name="Plantain" detail="Fried Plantain" price="100" isAvailable />

			{/* Extra Item 2 */}
			<ExtraItemRow name="Moi Moi" detail="Bean Pudding" price="200" isAvailable />

			{/* Dashed Add Button */}
			<AddExtraModal
				mode="create"
				trigger={
					<Button className="border-border text-muted-foreground hover:bg-muted/10 hover:border-primary/50 hover:text-primary mt-4 h-14 w-full rounded-xl border-2 border-dashed bg-transparent">
						<Icon icon="ph:plus" className="mr-2" />
						Add New Extra
					</Button>
				}
			/>
		</div>
	);
}

function ExtraItemRow({ name, detail, price, isAvailable }: any) {
	return (
		<div className="border-border flex flex-col justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
			<span className="text-foreground font-medium">{name}</span>

			<div className="flex flex-wrap items-center gap-3 sm:gap-4">
				<Badge
					variant="secondary"
					className="rounded-md border-none bg-[#FFE4E6] font-normal text-[#BE123C] hover:bg-[#FFE4E6]"
				>
					{detail}
				</Badge>

				<Badge
					variant="outline"
					className="rounded-md border-[#FEF08A] bg-[#FEFCE8] font-medium text-[#A16207]"
				>
					₦ {price}
				</Badge>

				<Badge className="rounded-md border-none bg-[#DCFCE7] font-medium text-[#15803D] shadow-none hover:bg-[#DCFCE7]">
					{isAvailable ? "Available" : "Unavailable"}
				</Badge>

				<div className="border-border/50 flex items-center gap-3 border-l pl-2 sm:ml-4">
					<AddExtraModal
						mode="edit"
						initialData={{ name, price, description: detail }}
						trigger={
							<Icon
								icon="ph:pencil-simple"
								className="text-muted-foreground hover:text-foreground size-5 cursor-pointer transition-colors"
							/>
						}
					/>
					<Icon
						icon="ph:trash"
						className="text-muted-foreground hover:text-destructive size-5 cursor-pointer transition-colors"
					/>
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
