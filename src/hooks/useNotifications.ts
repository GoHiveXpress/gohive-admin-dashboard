// src/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/app/api/notifications";
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

export const useMarkAllAsRead = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: () => notificationApi.markAllAsRead(),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("All notifications marked as read");
				queryClient.invalidateQueries({ queryKey: ["notifications"] });
			}
		},
	});
};

export const useDeleteNotification = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationApi.deleteNotification(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

export const useDeleteAllNotifications = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: () => notificationApi.deleteAllNotifications(),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("All notifications cleared");
				queryClient.invalidateQueries({ queryKey: ["notifications"] });
			}
		},
	});
};
