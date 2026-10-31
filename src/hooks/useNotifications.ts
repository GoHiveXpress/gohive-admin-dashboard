// src/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/services/notifications";
import { useToast } from "@/hooks/useToast";

export const useNotifications = () => {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: () => notificationApi.getNotifications(),
		refetchInterval: 30000, // Polling every 30 seconds as a fallback
	});
};

export const useMarkAsRead = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationApi.markAsRead(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

export const useMarkAllAsRead = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: () => notificationApi.markAllAsRead(),
		onSuccess: async (data) => {
			if (data.success) {
				toast.success("All notifications marked as read");
				await queryClient.invalidateQueries({ queryKey: ["notifications"] });
			}
		},
	});
};

export const useDeleteNotification = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationApi.deleteNotification(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

export const useDeleteAllNotifications = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: () => notificationApi.deleteAllNotifications(),
		onSuccess: async (data) => {
			if (data.success) {
				toast.success("All notifications cleared");
				await queryClient.invalidateQueries({ queryKey: ["notifications"] });
			}
		},
	});
};
