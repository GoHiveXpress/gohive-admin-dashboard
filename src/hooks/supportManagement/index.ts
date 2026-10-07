// src/hooks/supportManagement/index.ts
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, no-console */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "@/app/api/supportManagement";
import { useToast } from "@/hooks/useToast";
import { io, type Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/auth";
import { type ISupportChat, type ISupportUser } from "@/types/supportManagement";

const adminApiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "http://localhost:5000/api";

// Socket URL logic: Remove /api from the base URL
const SOCKET_URL = adminApiBaseUrl.replace("/api", "");

// Chats whose user account was deleted come back with user: null
const deletedUser = (chat: ISupportChat): ISupportUser => ({
	_id: "",
	name: "Deleted user",
	email: "",
	role: chat.role,
});

export const useAllChats = () => {
	return useQuery({
		queryKey: ["support-chats"],
		queryFn: supportApi.getAllChats,
		select: (res) => ({
			...res,
			data: (res.data ?? []).map((chat) =>
				chat.user ? chat : { ...chat, user: deletedUser(chat) },
			),
		}),
		// The socket keeps the list live; this is a fallback if it drops
		refetchInterval: 30_000,
	});
};

export const useChatHistory = (chatId: string) => {
	return useQuery({
		queryKey: ["support-chat-history", chatId],
		queryFn: () => supportApi.getChatHistory(chatId),
		enabled: !!chatId,
	});
};

export const useSendMessage = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: supportApi.sendMessage,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["support-chat-history", variables.chatId],
			});
			queryClient.invalidateQueries({ queryKey: ["support-chats"] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to send message");
		},
	});
};

export const useJoinChat = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: supportApi.joinChat,
		onSuccess: (data, chatId) => {
			toast.success("Joined chat successfully");
			queryClient.invalidateQueries({
				queryKey: ["support-chat-history", chatId],
			});
			queryClient.invalidateQueries({ queryKey: ["support-chats"] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to join chat");
		},
	});
};

export const useCloseChat = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: supportApi.closeChat,
		onSuccess: (data, chatId) => {
			toast.success("Chat closed successfully");
			queryClient.invalidateQueries({
				queryKey: ["support-chat-history", chatId],
			});
			queryClient.invalidateQueries({ queryKey: ["support-chats"] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to close chat");
		},
	});
};

/**
 * Socket Hook for real-time support.
 * Signs in with the dashboard token (the server rejects sockets without one), keeps the
 * chat list live through "support_chat_activity", and listens to the selected chat's room.
 */
export const useSupportSocket = (chatId?: string) => {
	const queryClient = useQueryClient();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const s = io(SOCKET_URL, {
			transports: ["websocket", "polling"],
			withCredentials: true,
			// Called on every (re)connect, so a refreshed token is picked up
			auth: (cb) => {
				getAuthToken()
					.then((token) => cb({ token: token ?? "" }))
					.catch(() => cb({ token: "" }));
			},
		});

		s.on("connect", () => setIsConnected(true));
		s.on("disconnect", () => setIsConnected(false));
		s.on("connect_error", (err) => {
			console.warn("Support socket connection failed:", err.message);
		});
		// Any chat changed (new chat, message, agent request, join, close)
		s.on("support_chat_activity", () => {
			queryClient.invalidateQueries({ queryKey: ["support-chats"] });
		});

		setSocket(s);
		return () => {
			s.disconnect();
			setSocket(null);
		};
	}, [queryClient]);

	// Listen to the selected chat's room; rejoin after a reconnect
	useEffect(() => {
		if (!socket || !chatId) return undefined;
		const join = () => socket.emit("join_chat_room", chatId);
		if (socket.connected) join();
		socket.on("connect", join);
		return () => {
			socket.off("connect", join);
			socket.emit("leave_chat_room", chatId);
		};
	}, [socket, chatId]);

	return { socket, isConnected };
};

/* eslint-enable */
