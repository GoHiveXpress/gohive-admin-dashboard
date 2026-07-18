import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { integrationSettingsApi } from "@/app/api/integrationSettings";

export const useApiKeys = () => {
	return useQuery({
		queryKey: ["integration-api-keys"],
		queryFn: integrationSettingsApi.getApiKeys,
	});
};

export const useCreateApiKey = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (description: string) => integrationSettingsApi.createApiKey(description),
		onSuccess: () => {
			toast.success("API key generated successfully");
			queryClient.invalidateQueries({ queryKey: ["integration-api-keys"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useUpdateApiKeyStatus = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: "Active" | "Inactive" }) =>
			integrationSettingsApi.updateApiKeyStatus(id, status),
		onSuccess: () => {
			toast.success("API key status updated");
			queryClient.invalidateQueries({ queryKey: ["integration-api-keys"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useDeleteApiKey = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => integrationSettingsApi.deleteApiKey(id),
		onSuccess: () => {
			toast.success("API key deleted");
			queryClient.invalidateQueries({ queryKey: ["integration-api-keys"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useWebhooks = () => {
	return useQuery({
		queryKey: ["integration-webhooks"],
		queryFn: integrationSettingsApi.getWebhooks,
	});
};

export const useCreateWebhook = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: { url: string; description?: string }) =>
			integrationSettingsApi.createWebhook(payload),
		onSuccess: () => {
			toast.success("Webhook created");
			queryClient.invalidateQueries({ queryKey: ["integration-webhooks"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useUpdateWebhook = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: { url?: string; description?: string; status?: "Active" | "Inactive" } }) =>
			integrationSettingsApi.updateWebhook(id, payload),
		onSuccess: () => {
			toast.success("Webhook updated");
			queryClient.invalidateQueries({ queryKey: ["integration-webhooks"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useDeleteWebhook = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => integrationSettingsApi.deleteWebhook(id),
		onSuccess: () => {
			toast.success("Webhook deleted");
			queryClient.invalidateQueries({ queryKey: ["integration-webhooks"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};
