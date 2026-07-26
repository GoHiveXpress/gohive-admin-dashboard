// src/hooks/supportManagement/index.ts
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, no-console */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "@/app/api/supportManagement";
import { useToast } from "@/hooks/useToast";
import { io, type Socket } from "socket.io-client";
import { useEffect, useState, useRef } from "react";

const adminApiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "http://localhost:5000/api";

// Socket URL logic: Remove /api from the base URL
const SOCKET_URL = adminApiBaseUrl.replace("/api", "");

export const useAllChats = () => {
	return useQuery({
		queryKey: ["support-chats"],
		queryFn: supportApi.getAllChats,
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
 * Socket Hook for real-time support
 */
export const useSupportSocket = (chatId?: string) => {
	const socketRef = useRef<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		// Create socket instance
		const socket = io(SOCKET_URL, {
			transports: ["websocket", "polling"],
			withCredentials: true,
		});

		socketRef.current = socket;

		socket.on("connect", () => {
			console.log("🔌 Connected to Support Socket");
			setIsConnected(true);
			if (chatId) {
				socket.emit("join_chat_room", chatId);
			}
		});

		socket.on("disconnect", () => {
			console.log("🔌 Disconnected from Support Socket");
			setIsConnected(false);
		});

		return () => {
			if (socket) socket.disconnect();
		};
	}, [chatId]);

	return { socket: socketRef.current, isConnected };
};

/* eslint-enable */
