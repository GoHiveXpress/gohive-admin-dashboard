// src/components/Navbar/index.tsx

"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/Sidebar";

export default function Navbar() {
	return (
		<header className="bg-background border-border sticky top-0 z-40 flex h-20 items-center justify-between border-b px-4 lg:px-8">
			<div className="flex items-center gap-4">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="lg:hidden">
							<Menu className="text-foreground size-6" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="border-border w-[280px] border-r p-0">
						<Sidebar className="flex w-full border-none" />
					</SheetContent>
				</Sheet>

				<h1 className="text-foreground text-xl font-bold lg:text-2xl">Victor Kenny</h1>
			</div>

			<div className="flex items-center gap-3 lg:gap-6">
				<Button
					variant="ghost"
					size="icon"
					className="border-border hover:bg-muted size-10 rounded-full border"
				>
					<Search className="text-muted-foreground size-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="border-border hover:bg-muted relative size-10 rounded-full border"
				>
					<Bell className="text-muted-foreground size-5" />

					<span className="bg-destructive border-background absolute right-2.5 top-2 size-2 rounded-full border" />
				</Button>

				<div className="relative">
					<Avatar className="border-border size-10 border">
						<AvatarImage src="/assets/user_avatar.png" alt="User" />

						<AvatarFallback className="text-muted-foreground">VK</AvatarFallback>
					</Avatar>

					<span className="bg-secondary border-background absolute bottom-0 right-0 size-3 rounded-full border-2" />
				</div>
			</div>
		</header>
	);
}
