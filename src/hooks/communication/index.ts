// src/hooks/communication/index.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { communicationApi } from "@/app/api/communication";
import { useToast } from "@/hooks/useToast";
import { type ICreateTemplateRequest } from "@/types/communication";

const apiMessage = (error: Error) =>
	isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;

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
				queryClient
					.invalidateQueries({ queryKey: ["notification-templates"] })
					.catch(() => undefined);
			}
		},
		onError: (error: Error) => {
			toast.error(apiMessage(error) ?? "Failed to create template");
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
				queryClient
					.invalidateQueries({ queryKey: ["notification-templates"] })
					.catch(() => undefined);
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
			queryClient
				.invalidateQueries({ queryKey: ["notification-templates"] })
				.catch(() => undefined);
		},
	});
};

export const useCommunications = (type?: string) => {
	return useQuery({
		queryKey: ["communications", type],
		queryFn: () => communicationApi.getCommunications(type),
	});
};

export const useAudienceCount = (type: string, roles: string[], enabled: boolean) => {
	const sortedRoles = [...roles].sort();
	return useQuery({
		queryKey: ["communication-audience", type, sortedRoles],
		queryFn: () => communicationApi.getAudienceCount(type, sortedRoles),
		enabled: enabled && sortedRoles.length > 0,
		// Counts move slowly; re-check each time the dialog opens
		staleTime: 0,
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
				queryClient
					.invalidateQueries({ queryKey: ["communications"] })
					.catch(() => undefined);
			}
		},
		onError: (error: Error) => {
			toast.error(apiMessage(error) ?? "Failed to send");
		},
	});
};
