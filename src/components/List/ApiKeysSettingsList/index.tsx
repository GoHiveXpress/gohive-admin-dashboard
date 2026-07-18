"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	getApiKeysSettingsColumns,
	type ApiKeyData,
} from "@/components/Tables/columns/ApiKeysSettingsColumns";
import {
	useApiKeys,
	useCreateApiKey,
	useDeleteApiKey,
	useUpdateApiKeyStatus,
} from "@/hooks/integrationSettings";
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

export default function ApiKeysSettingsList() {
	const { data, isLoading, isError } = useApiKeys();
	const createMutation = useCreateApiKey();
	const updateStatusMutation = useUpdateApiKeyStatus();
	const deleteMutation = useDeleteApiKey();
	const toast = useToast();

	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [description, setDescription] = useState("");

	const apiKeyRows = useMemo<ApiKeyData[]>(() => {
		return (data?.data ?? []).map((item) => ({
			_id: item._id,
			description: item.description,
			apiKey: item.apiKey,
			timestamp: item.timestamp,
			status: item.status,
		}));
	}, [data]);

	const handleCreate = async () => {
		if (!description.trim()) {
			toast.error("Description is required");
			return;
		}

		const response = await createMutation.mutateAsync(description.trim());
		const generatedKey = response.data.oneTimeKey;
		if (generatedKey) {
			toast.success(`Copy and store this key now: ${generatedKey}`);
		}
		setOpenCreateDialog(false);
		setDescription("");
	};

	const handleToggleStatus = (row: ApiKeyData) => {
		const newStatus = row.status === "Active" ? "Inactive" : "Active";
		updateStatusMutation.mutate({ id: row._id, status: newStatus });
	};

	const handleDelete = (row: ApiKeyData) => {
		deleteMutation.mutate(row._id);
	};

	const columns = getColumns(getApiKeysSettingsColumns(handleToggleStatus, handleDelete));

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<Button
					onClick={() => setOpenCreateDialog(true)}
					className="bg-secondary hover:bg-secondary/90 h-10 gap-2 rounded-lg px-4 text-white"
				>
					<Icon icon="lucide:plus-circle" className="size-5" />
					Generate New Key
				</Button>
			</div>

			<div className="border-border overflow-hidden rounded-[20px] border bg-white p-0 shadow-sm">
				{isLoading ? (
					<div className="text-muted-foreground py-10 text-center">Loading API keys...</div>
				) : isError ? (
					<div className="text-destructive py-10 text-center">Failed to load API keys</div>
				) : (
					<DataTable columns={columns} data={apiKeyRows} />
				)}
			</div>

			<Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Generate API Key</DialogTitle>
						<DialogDescription>
							Provide a short description to identify this key later.
						</DialogDescription>
					</DialogHeader>
					<Input
						placeholder="e.g. Internal dashboard integration"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={createMutation.isPending}
							className="bg-secondary text-white hover:bg-secondary/90"
						>
							{createMutation.isPending ? "Generating..." : "Generate"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
