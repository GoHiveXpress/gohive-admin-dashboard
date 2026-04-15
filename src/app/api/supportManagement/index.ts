// src/app/api/supportManagement/index.ts
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, import/prefer-default-export */
import axiosInstance from "@/lib/axiosInstance";
import {
	type IGetAllChatsResponse,
	type IGetChatHistoryResponse,
	type ISendMessageResponse,
} from "@/types/supportManagement";

export const supportApi = {
	getAllChats: async (): Promise<IGetAllChatsResponse> => {
		const response = await axiosInstance.get("/support-chat/admin/all");
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
