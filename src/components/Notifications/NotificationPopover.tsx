// src/components/Notifications/NotificationPopover.tsx
"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { 
	useNotifications, 
	useMarkAllAsRead, 
	useDeleteAllNotifications 
} from "@/hooks/useNotifications";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationItem from "./NotificationItem";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function NotificationPopover() {
	const { data, isLoading } = useNotifications();
	const { mutate: markAllAsRead } = useMarkAllAsRead();
	const { mutate: deleteAll } = useDeleteAllNotifications();

	const notifications = data?.data || [];
	const unreadCount = data?.unreadCount || 0;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="border-border hover:bg-muted relative size-10 rounded-full border"
				>
					<Bell className="text-muted-foreground size-5" />
					{unreadCount > 0 && (
						<Badge 
							className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive p-1 text-[10px] font-bold text-destructive-foreground border-2 border-background"
						>
							{unreadCount > 9 ? "9+" : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0 sm:w-[400px]" align="end">
				<div className="flex items-center justify-between p-4">
					<div className="space-y-1">
						<h3 className="font-bold leading-none">Notifications</h3>
						<p className="text-xs text-muted-foreground">
							You have {unreadCount} unread messages
						</p>
					</div>
					<div className="flex items-center gap-1">
						{unreadCount > 0 && (
							<Button 
								variant="ghost" 
								size="icon" 
								className="h-8 w-8 text-primary hover:bg-primary/10"
								title="Mark all as read"
								onClick={() => markAllAsRead()}
							>
								<Icon icon="mdi:check-all" className="h-5 w-5" />
							</Button>
						)}
						{notifications.length > 0 && (
							<Button 
								variant="ghost" 
								size="icon" 
								className="h-8 w-8 text-destructive hover:bg-destructive/10"
								title="Clear all"
								onClick={() => deleteAll()}
							>
								<Icon icon="mdi:delete-sweep-outline" className="h-5 w-5" />
							</Button>
						)}
					</div>
				</div>
				<Separator />
				
				<ScrollArea className="h-[400px]">
					{isLoading ? (
						<div className="flex h-full items-center justify-center p-8 text-muted-foreground">
							<Icon icon="mdi:loading" className="h-6 w-6 animate-spin mr-2" />
							Loading...
						</div>
					) : notifications.length > 0 ? (
						<div className="flex flex-col">
							{notifications.map((notif) => (
								<NotificationItem key={notif._id} notification={notif} />
							))}
						</div>
					) : (
						<div className="flex h-[300px] flex-col items-center justify-center p-8 text-center text-muted-foreground">
							<div className="mb-4 rounded-full bg-muted p-4">
								<Bell className="h-8 w-8" />
							</div>
							<p className="font-medium text-foreground">No notifications</p>
							<p className="text-sm">When you get notifications, they'll show up here.</p>
						</div>
					)}
				</ScrollArea>
				
				<Separator />
				<div className="p-2">
					<Button variant="ghost" className="w-full text-xs" size="sm" asChild>
						<Link href="/settings?tab=activities">View all activity</Link>
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
