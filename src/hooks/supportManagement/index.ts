// src/hooks/supportManagement/index.ts
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
import {
	type InfiniteData,
	type QueryClient,
	useInfiniteQuery,
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supportApi } from "@/app/api/supportManagement";
import { useToast } from "@/hooks/useToast";
import { io, type Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { getAuthToken } from "@/utils/auth";
import {
	type IChatActivity,
	type IChatListParams,
	type IGetAllChatsResponse,
	type ISupportChat,
	type ISupportUser,
} from "@/types/supportManagement";

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

type ChatPages = InfiniteData<IGetAllChatsResponse, string | undefined>;

const USER_ROLES = new Set(["customer", "vendor", "rider"]);

/**
 * One page of chats at a time (newest activity first), filtered on the server by
 * status, role and search. "Load more" fetches the next page.
 */
export const useAllChats = (params: IChatListParams) => {
	return useInfiniteQuery({
		queryKey: ["support-chats", params],
		queryFn: ({ pageParam }) => supportApi.getAllChats({ ...params, before: pageParam }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (last) => (last.hasMore ? (last.nextBefore ?? undefined) : undefined),
		select: (res) => ({
			chats: res.pages
				.flatMap((page) => page.data ?? [])
				.map((chat) => (chat.user ? chat : { ...chat, user: deletedUser(chat) })),
			counts: res.pages[0]?.counts,
		}),
		// The socket keeps the list live; this is a fallback if it drops
		refetchInterval: 60_000,
	});
};

// Apply a change to every cached copy of one chat. Returns false if no list has it.
const patchCachedChat = (
	queryClient: QueryClient,
	chatId: string,
	patch: (chat: ISupportChat) => ISupportChat,
) => {
	let found = false;
	queryClient.setQueriesData<ChatPages>({ queryKey: ["support-chats"] }, (old) => {
		if (!old) return old;
		return {
			...old,
			pages: old.pages.map((page) => ({
				...page,
				data: (page.data ?? []).map((chat) => {
					if (chat._id !== chatId) return chat;
					found = true;
					return patch(chat);
				}),
			})),
		};
	});
	return found;
};

/** Marks the chat read for this agent and clears its unread badge straight away. */
export const useMarkChatRead = () => {
	const queryClient = useQueryClient();
	return (chatId: string) => {
		patchCachedChat(queryClient, chatId, (chat) => ({ ...chat, unreadCount: 0 }));
		supportApi.markRead(chatId).catch(() => {
			// Not worth bothering the agent; the badge comes back on the next refresh
		});
	};
};

export const useChatContext = (chatId?: string) => {
	return useQuery({
		queryKey: ["support-chat-context", chatId],
		queryFn: () => supportApi.getChatContext(chatId!),
		enabled: !!chatId,
		staleTime: 60_000,
	});
};

export const useQuickReplies = () => {
	return useQuery({
		queryKey: ["support-quick-replies"],
		queryFn: supportApi.getQuickReplies,
		staleTime: 5 * 60_000,
	});
};

export const useCreateQuickReply = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: supportApi.createQuickReply,
		onSuccess: () => {
			toast.success("Quick reply saved");
			queryClient.invalidateQueries({ queryKey: ["support-quick-replies"] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message ?? "Couldn't save the quick reply");
		},
	});
};

export const useDeleteQuickReply = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: supportApi.deleteQuickReply,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["support-quick-replies"] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message ?? "Couldn't delete the quick reply");
		},
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

export const useTakeoverChat = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: supportApi.takeoverChat,
		onSuccess: (data, chatId) => {
			toast.success(data?.message || "You have taken over this chat");
			queryClient.invalidateQueries({
				queryKey: ["support-chat-history", chatId],
			});
			queryClient.invalidateQueries({ queryKey: ["support-chats"] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to take over the chat");
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
	// The open chat, read inside the socket handler without reconnecting
	const openChatId = useRef(chatId);
	openChatId.current = chatId;

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
		// Patch the chat in place; only refetch when it isn't in the list yet (a new chat)
		s.on("support_chat_activity", (activity: IChatActivity) => {
			const changedId = String(activity.chatId);
			const fromUser = !!activity.senderRole && USER_ROLES.has(activity.senderRole);
			const found = patchCachedChat(queryClient, changedId, (chat) => ({
				...chat,
				status: activity.status ?? chat.status,
				lastMessage: activity.lastMessage ?? chat.lastMessage,
				admin: activity.admin ?? undefined,
				adminName: activity.adminName ?? undefined,
				agentRequestedAt: activity.agentRequestedAt,
				waitingSince: activity.waitingSince,
				lastUserMessageAt: activity.lastUserMessageAt ?? chat.lastUserMessageAt,
				updatedAt: activity.updatedAt ?? chat.updatedAt,
				unreadCount:
					fromUser && changedId !== openChatId.current
						? (chat.unreadCount ?? 0) + 1
						: chat.unreadCount,
			}));
			if (!found || activity.isNew) {
				queryClient.invalidateQueries({ queryKey: ["support-chats"] });
			}
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
