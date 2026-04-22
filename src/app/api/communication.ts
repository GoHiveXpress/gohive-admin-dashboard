// src/app/api/communication.ts
import axiosInstance from "@/lib/axiosInstance";
import { 
    INotificationTemplate, 
    ICommunication, 
    ICreateTemplateRequest, 
    ICreateCommunicationRequest 
} from "@/types/communication";

export const communicationApi = {
	// Templates
	getTemplates: async () => {
		const response = await axiosInstance.get<{ success: boolean; data: INotificationTemplate[] }>("/admin/templates");
		return response.data;
	},
	createTemplate: async (data: FormData) => {
		const response = await axiosInstance.post<{ success: boolean; data: INotificationTemplate }>("/admin/templates", data, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	},
	updateTemplate: async (id: string, data: ICreateTemplateRequest) => {
		const response = await axiosInstance.put<{ success: boolean; data: INotificationTemplate }>(`/admin/templates/${id}`, data);
		return response.data;
	},
	deleteTemplate: async (id: string) => {
		const response = await axiosInstance.delete<{ success: boolean; message: string }>(`/admin/templates/${id}`);
		return response.data;
	},

	// Communications (Broadcasts & Campaigns)
	getCommunications: async (type?: string) => {
		const response = await axiosInstance.get<{ success: boolean; data: ICommunication[] }>(`/admin/communication${type ? `?type=${type}` : ""}`);
		return response.data;
	},
	getCommunicationById: async (id: string) => {
		const response = await axiosInstance.get<{ success: boolean; data: ICommunication }>(`/admin/communication/${id}`);
		return response.data;
	},
	createCommunication: async (data: FormData) => {
		const response = await axiosInstance.post<{ success: boolean; data: ICommunication }>("/admin/communication", data, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	},
};
