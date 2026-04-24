// src/app/api/notifications.ts
import axiosInstance from "@/lib/axiosInstance";
import { 
	INotificationResponse, 
	IMarkReadResponse, 
	ICommonResponse 
} from "@/types/notification";

export const notificationApi = {
	getNotifications: async () => {
		const response = await axiosInstance.get<INotificationResponse>("/notifications");
		return response.data;
	},

	markAsRead: async (id: string) => {
		const response = await axiosInstance.put<IMarkReadResponse>(`/notifications/${id}/read`);
		return response.data;
	},

	markAllAsRead: async () => {
		const response = await axiosInstance.put<ICommonResponse>("/notifications/read-all");
		return response.data;
	},

	deleteNotification: async (id: string) => {
		const response = await axiosInstance.delete<ICommonResponse>(`/notifications/${id}`);
		return response.data;
	},

	deleteAllNotifications: async () => {
		const response = await axiosInstance.delete<ICommonResponse>("/notifications");
		return response.data;
	},
};
