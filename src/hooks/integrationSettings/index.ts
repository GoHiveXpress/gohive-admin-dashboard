import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { integrationSettingsApi } from "@/services/integrationSettings";
import { type UpdateFeeConfigPayload, type WebhookPayload } from "@/types/integrationSettings";

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

const WEBHOOKS_KEY = ["integration-webhooks"];

export const useWebhooks = () =>
	useQuery({
		queryKey: WEBHOOKS_KEY,
		queryFn: integrationSettingsApi.getWebhooks,
	});

export const useWebhookEvents = () =>
	useQuery({
		queryKey: ["integration-webhook-events"],
		queryFn: integrationSettingsApi.getWebhookEvents,
		staleTime: Infinity,
	});

export const useWebhookDeliveries = (id: string | null, page: number) =>
	useQuery({
		queryKey: ["integration-webhook-deliveries", id, page],
		queryFn: () => integrationSettingsApi.getWebhookDeliveries(id ?? "", page),
		enabled: !!id,
		placeholderData: keepPreviousData,
	});

// Create and rotate return the signing secret, once; callers show it from
// the mutation result.
export const useCreateWebhook = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: WebhookPayload & { url: string }) =>
			integrationSettingsApi.createWebhook(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY }),
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useRotateWebhookSecret = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => integrationSettingsApi.rotateWebhookSecret(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY }),
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useUpdateWebhook = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: WebhookPayload }) =>
			integrationSettingsApi.updateWebhook(id, payload),
		onSuccess: () => {
			toast.success("Webhook updated");
			return queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY });
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
			return queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useTestWebhook = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => integrationSettingsApi.testWebhook(id),
		onSuccess: (data, id) => {
			if (data.data.ok) toast.success(`Test delivered (HTTP ${data.data.status ?? "?"})`);
			else
				toast.error(`Test failed: ${data.data.error ?? `HTTP ${data.data.status ?? "?"}`}`);
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY }),
				queryClient.invalidateQueries({ queryKey: ["integration-webhook-deliveries", id] }),
			]);
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};
