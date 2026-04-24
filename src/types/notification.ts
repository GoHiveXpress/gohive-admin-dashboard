// src/types/notification.ts

export interface INotification {
	_id: string;
	recipient: string;
	title: string;
	message: string;
	type: "order" | "wallet" | "auth" | "system" | "wishlist" | "rating";
	data: any;
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface INotificationResponse {
	success: boolean;
	data: INotification[];
	unreadCount: number;
}

export interface IMarkReadResponse {
	success: boolean;
	data: INotification;
}

export interface ICommonResponse {
	success: boolean;
	message: string;
}
