// src/components/Navbar/index.tsx
"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/Sidebar";

export default function Navbar() {
	return (
		<header className="h-20 bg-background border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
			<div className="flex items-center gap-4">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="lg:hidden">
							<Menu className="h-6 w-6 text-foreground" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="p-0 w-[280px] border-r border-border">
						<Sidebar className="flex w-full border-none" />
					</SheetContent>
				</Sheet>

				<h1 className="text-xl lg:text-2xl font-bold text-foreground">Victor Kenny</h1>
			</div>

			<div className="flex items-center gap-3 lg:gap-6">
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full h-10 w-10 border border-border hover:bg-muted"
				>
					<Search className="h-5 w-5 text-muted-foreground" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-full h-10 w-10 border border-border hover:bg-muted relative"
				>
					<Bell className="h-5 w-5 text-muted-foreground" />

					<span className="absolute top-2 right-2.5 h-2 w-2 bg-destructive rounded-full border border-background"></span>
				</Button>

				<div className="relative">
					<Avatar className="h-10 w-10 border border-border">
						<AvatarImage src="/assets/user_avatar.png" alt="User" />

						<AvatarFallback className="text-muted-foreground">VK</AvatarFallback>
					</Avatar>

					<span className="absolute bottom-0 right-0 h-3 w-3 bg-secondary rounded-full border-2 border-background"></span>
				</div>
			</div>
		</header>
	);
}
