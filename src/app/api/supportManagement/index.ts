// src/app/api/supportManagement/index.ts
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, import/prefer-default-export */
import axiosInstance from "@/lib/axiosInstance";
import {
	type IChatContext,
	type IChatListParams,
	type IQuickReply,
	type IGetAllChatsResponse,
	type IGetChatHistoryResponse,
	type ISendMessageResponse,
} from "@/types/supportManagement";

export const supportApi = {
	getAllChats: async (
		params: IChatListParams & { before?: string } = {},
	): Promise<IGetAllChatsResponse> => {
		const response = await axiosInstance.get("/support-chat/admin/all", { params });
		return response.data;
	},

	markRead: async (chatId: string): Promise<any> => {
		const response = await axiosInstance.post(`/support-chat/admin/read/${chatId}`);
		return response.data;
	},

	getChatContext: async (chatId: string): Promise<{ success: boolean; data: IChatContext }> => {
		const response = await axiosInstance.get(`/support-chat/admin/context/${chatId}`);
		return response.data;
	},

	getQuickReplies: async (): Promise<{ success: boolean; data: IQuickReply[] }> => {
		const response = await axiosInstance.get("/support-chat/admin/quick-replies");
		return response.data;
	},

	createQuickReply: async (payload: {
		title: string;
		body: string;
	}): Promise<{ success: boolean; data: IQuickReply }> => {
		const response = await axiosInstance.post("/support-chat/admin/quick-replies", payload);
		return response.data;
	},

	deleteQuickReply: async (id: string): Promise<any> => {
		const response = await axiosInstance.delete(`/support-chat/admin/quick-replies/${id}`);
		return response.data;
	},

	getChatHistory: async (chatId: string): Promise<IGetChatHistoryResponse> => {
		const response = await axiosInstance.get(`/support-chat/history/${chatId}`);
		return response.data;
	},

	sendMessage: async (payload: {
		chatId: string;
		content: string;
		type?: string;
	}): Promise<ISendMessageResponse> => {
		const response = await axiosInstance.post("/support-chat/message", payload);
		return response.data;
	},

	joinChat: async (chatId: string): Promise<any> => {
		const response = await axiosInstance.post("/support-chat/join", { chatId });
		return response.data;
	},

	closeChat: async (chatId: string): Promise<any> => {
		const response = await axiosInstance.post(`/support-chat/close/${chatId}`);
		return response.data;
	},

	uploadFile: async (formData: FormData): Promise<{ success: boolean; url: string }> => {
		const response = await axiosInstance.post("/support-chat/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},
};

/* eslint-enable */
