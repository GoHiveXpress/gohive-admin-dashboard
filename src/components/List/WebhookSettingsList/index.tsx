"use client";

import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	getWebhookSettingsColumns,
	type WebhookData,
} from "@/components/Tables/columns/WebhookSettingsColumns";
import {
	useCreateWebhook,
	useDeleteWebhook,
	useUpdateWebhook,
	useWebhooks,
} from "@/hooks/integrationSettings";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";

export default function WebhookSettingsList() {
	const { data, isLoading, isError } = useWebhooks();
	const createMutation = useCreateWebhook();
	const updateMutation = useUpdateWebhook();
	const deleteMutation = useDeleteWebhook();
	const toast = useToast();

	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [url, setUrl] = useState("");
	const [description, setDescription] = useState("");

	const rows = useMemo<WebhookData[]>(() => {
		return (data?.data ?? []).map((item) => ({
			_id: item._id,
			url: item.url,
			description: item.description,
			timestamp: item.timestamp,
			status: item.status,
		}));
	}, [data]);

	const handleCreate = async () => {
		if (!url.trim()) {
			toast.error("Webhook URL is required");
			return;
		}

		await createMutation.mutateAsync({ url: url.trim(), description: description.trim() });
		setOpenCreateDialog(false);
		setUrl("");
		setDescription("");
	};

	const handleToggleStatus = (row: WebhookData) => {
		const status = row.status === "Active" ? "Inactive" : "Active";
		updateMutation.mutate({ id: row._id, payload: { status } });
	};

	const handleDelete = (row: WebhookData) => {
		deleteMutation.mutate(row._id);
	};

	const columns = getColumns(getWebhookSettingsColumns(handleToggleStatus, handleDelete));

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button
					onClick={() => setOpenCreateDialog(true)}
					className="bg-secondary hover:bg-secondary/90 h-10 gap-2 rounded-lg px-4 text-white"
				>
					<Icon icon="lucide:plus-circle" className="size-5" />
					Add Webhook
				</Button>
			</div>

			<div className="border-border mt-2 overflow-hidden rounded-[20px] border bg-white p-0 shadow-sm">
				{isLoading ? (
					<div className="text-muted-foreground py-10 text-center">Loading webhooks...</div>
				) : isError ? (
					<div className="text-destructive py-10 text-center">Failed to load webhooks</div>
				) : (
					<DataTable columns={columns} data={rows} />
				)}
			</div>

			<Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Webhook</DialogTitle>
						<DialogDescription>
							Provide endpoint details for outbound event delivery.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3">
						<Input
							placeholder="https://example.com/webhooks/gohive"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
						/>
						<Input
							placeholder="Description (optional)"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={createMutation.isPending}
							className="bg-secondary text-white hover:bg-secondary/90"
						>
							{createMutation.isPending ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
