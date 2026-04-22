// src/hooks/communication/index.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationApi } from "@/app/api/communication";
import { useToast } from "@/hooks/useToast";
import { ICreateTemplateRequest, ICreateCommunicationRequest } from "@/types/communication";

export const useTemplates = () => {
	return useQuery({
		queryKey: ["notification-templates"],
		queryFn: () => communicationApi.getTemplates(),
	});
};

export const useCreateTemplate = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: (data: FormData) => communicationApi.createTemplate(data),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("Template created successfully");
				queryClient.invalidateQueries({ queryKey: ["notification-templates"] });
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create template");
		},
	});
};

export const useUpdateTemplate = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ICreateTemplateRequest }) =>
			communicationApi.updateTemplate(id, data),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("Template updated successfully");
				queryClient.invalidateQueries({ queryKey: ["notification-templates"] });
			}
		},
	});
};

export const useDeleteTemplate = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: (id: string) => communicationApi.deleteTemplate(id),
		onSuccess: () => {
			toast.success("Template deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notification-templates"] });
		},
	});
};

export const useCommunications = (type?: string) => {
	return useQuery({
		queryKey: ["communications", type],
		queryFn: () => communicationApi.getCommunications(type),
	});
};

export const useCreateCommunication = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: (data: FormData) => communicationApi.createCommunication(data),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("Sent successfully");
				queryClient.invalidateQueries({ queryKey: ["communications"] });
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to send");
		},
	});
};
