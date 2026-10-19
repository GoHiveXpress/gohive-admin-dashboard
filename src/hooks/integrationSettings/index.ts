import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { integrationSettingsApi } from "@/app/api/integrationSettings";
import { type UpdateFeeConfigPayload } from "@/types/integrationSettings";

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
			return queryClient.invalidateQueries({ queryKey: ["integration-api-keys"] });
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
			return queryClient.invalidateQueries({ queryKey: ["integration-api-keys"] });
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
			return queryClient.invalidateQueries({ queryKey: ["integration-api-keys"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useFeeConfig = () => {
	return useQuery({
		queryKey: ["integration-fee-config"],
		queryFn: integrationSettingsApi.getFeeConfig,
	});
};

export const useFeeHistory = () => {
	return useQuery({
		queryKey: ["integration-fee-history"],
		queryFn: integrationSettingsApi.getFeeHistory,
	});
};

export const useUpdateFeeConfig = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: UpdateFeeConfigPayload) =>
			integrationSettingsApi.updateFeeConfig(payload),
		onSuccess: () => {
			toast.success("Fee configuration updated");
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: ["integration-fee-config"] }),
				queryClient.invalidateQueries({ queryKey: ["integration-fee-history"] }),
			]);
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
			return queryClient.invalidateQueries({ queryKey: ["integration-webhooks"] });
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
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: { url?: string; description?: string; status?: "Active" | "Inactive" };
		}) => integrationSettingsApi.updateWebhook(id, payload),
		onSuccess: () => {
			toast.success("Webhook updated");
			return queryClient.invalidateQueries({ queryKey: ["integration-webhooks"] });
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
			return queryClient.invalidateQueries({ queryKey: ["integration-webhooks"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};
