// src/components/Notifications/NotificationItem.tsx
"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react";
import { INotification } from "@/types/notification";
import { useMarkAsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
	notification: INotification;
}

const getNotificationIcon = (type: INotification["type"]) => {
	switch (type) {
		case "order":
			return "mdi:shopping-outline";
		case "wallet":
			return "mdi:wallet-outline";
		case "auth":
			return "mdi:shield-check-outline";
		case "rating":
			return "mdi:star-outline";
		default:
			return "mdi:bell-outline";
	}
};

const getNotificationColor = (type: INotification["type"]) => {
	switch (type) {
		case "order":
			return "text-blue-500 bg-blue-50";
		case "wallet":
			return "text-green-500 bg-green-50";
		case "auth":
			return "text-purple-500 bg-purple-50";
		case "rating":
			return "text-yellow-500 bg-yellow-50";
		default:
			return "text-gray-500 bg-gray-50";
	}
};

export default function NotificationItem({ notification }: NotificationItemProps) {
	const { mutate: markAsRead, isPending: isMarking } = useMarkAsRead();
	const { mutate: deleteNotif, isPending: isDeleting } = useDeleteNotification();

	return (
		<div
			className={cn(
				"group relative flex gap-4 p-4 transition-colors hover:bg-muted/50",
				!notification.isRead && "bg-primary/5"
			)}
		>
			<div
				className={cn(
					"flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
					getNotificationColor(notification.type)
				)}
			>
				<Icon icon={getNotificationIcon(notification.type)} className="h-5 w-5" />
			</div>

			<div className="flex-1 space-y-1">
				<div className="flex items-start justify-between gap-2">
					<h4 className="text-sm font-semibold leading-none">{notification.title}</h4>
					<span className="text-[10px] text-muted-foreground whitespace-nowrap">
						{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
					</span>
				</div>
				<p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>

				<div className="flex items-center gap-2 pt-2 opacity-0 transition-opacity group-hover:opacity-100">
					{!notification.isRead && (
						<Button
							variant="ghost"
							size="sm"
							className="h-8 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
							onClick={() => markAsRead(notification._id)}
							disabled={isMarking}
						>
							{isMarking ? (
								<Icon icon="line-md:loading-twotone-loop" className="mr-1 h-3.5 w-3.5" />
							) : (
								<Icon icon="mdi:check" className="mr-1 h-3.5 w-3.5" />
							)}
							Mark as read
						</Button>
					)}
					<Button
						variant="ghost"
						size="sm"
						className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
						onClick={() => deleteNotif(notification._id)}
						disabled={isDeleting}
					>
						{isDeleting ? (
							<Icon icon="line-md:loading-twotone-loop" className="mr-1 h-3.5 w-3.5" />
						) : (
							<Icon icon="mdi:delete-outline" className="mr-1 h-3.5 w-3.5" />
						)}
						Delete
					</Button>
				</div>
			</div>

			{!notification.isRead && (
				<span className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
			)}
		</div>
	);
}
