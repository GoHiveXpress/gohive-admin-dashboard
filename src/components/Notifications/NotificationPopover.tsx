/* eslint-disable no-nested-ternary */
// src/components/Notifications/NotificationPopover.tsx

"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
	useNotifications,
	useMarkAllAsRead,
	useDeleteAllNotifications,
	useLiveNotifications,
} from "@/hooks/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NotificationItem from "./NotificationItem";

export default function NotificationPopover() {
	const { data, isLoading } = useNotifications();
	// The bell is in the navbar on every page, so this keeps it live everywhere
	useLiveNotifications();
	const { mutate: markAllAsRead } = useMarkAllAsRead();
	const { mutate: deleteAll } = useDeleteAllNotifications();

	const notifications = data?.data ?? [];
	const unreadCount = data?.unreadCount ?? 0;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					aria-label="Notifications"
					variant="ghost"
					size="icon"
					className="border-border hover:bg-muted relative size-10 rounded-full border"
				>
					<Bell className="text-muted-foreground size-5" />
					{unreadCount > 0 && (
						<Badge className="bg-destructive text-destructive-foreground border-background absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 p-1 text-[10px] font-bold">
							{unreadCount > 9 ? "9+" : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0 sm:w-[400px]" align="end">
				<div className="flex items-center justify-between p-4">
					<div className="space-y-1">
						<h3 className="font-bold leading-none">Notifications</h3>
						<p className="text-muted-foreground text-xs">
							You have {unreadCount} unread messages
						</p>
					</div>
					<div className="flex items-center gap-1">
						{unreadCount > 0 && (
							<Button
								aria-label="Mark all as read"
								variant="ghost"
								size="icon"
								className="text-primary hover:bg-primary/10 size-8"
								title="Mark all as read"
								onClick={() => markAllAsRead()}
							>
								<Icon icon="mdi:check-all" className="size-5" />
							</Button>
						)}
						{notifications.length > 0 && (
							<Button
								aria-label="Clear all notifications"
								variant="ghost"
								size="icon"
								className="text-destructive hover:bg-destructive/10 size-8"
								title="Clear all"
								onClick={() => deleteAll()}
							>
								<Icon icon="mdi:delete-sweep-outline" className="size-5" />
							</Button>
						)}
					</div>
				</div>
				<Separator />

				<ScrollArea className="h-[400px]">
					{isLoading ? (
						<div className="text-muted-foreground flex h-full items-center justify-center p-8">
							<Icon icon="mdi:loading" className="mr-2 size-6 animate-spin" />
							Loading...
						</div>
					) : notifications.length > 0 ? (
						<div className="flex flex-col">
							{notifications.map((notif) => (
								<NotificationItem key={notif._id} notification={notif} />
							))}
						</div>
					) : (
						<div className="text-muted-foreground flex h-[300px] flex-col items-center justify-center p-8 text-center">
							<div className="bg-muted mb-4 rounded-full p-4">
								<Bell className="size-8" />
							</div>
							<p className="text-foreground font-medium">No notifications</p>
							<p className="text-sm">
								When you get notifications, they&apos;ll show up here.
							</p>
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

/* eslint-enable */
