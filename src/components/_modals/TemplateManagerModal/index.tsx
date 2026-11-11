// src/components/_modals/TemplateManagerModal/index.tsx
// Add, edit and delete the saved templates the Quick Notification card sends.

"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateTemplate,
	useDeleteTemplate,
	useTemplates,
	useUpdateTemplate,
} from "@/hooks/communication";
import { type INotificationTemplate } from "@/types/communication";

// Same limits as the backend (controllers/admin/communicationController.js)
const TITLE_MAX = 120;
const MESSAGE_MAX = 1000;

interface TemplateManagerModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	// Called with a template that was just created, so the card can select it
	onCreated?: (template: INotificationTemplate) => void;
}

type Draft = {
	id: string | null; // null: a new template
	title: string;
	message: string;
	image: File | null;
	currentImage: string | null;
	removeImage: boolean;
};

const emptyDraft: Draft = {
	id: null,
	title: "",
	message: "",
	image: null,
	currentImage: null,
	removeImage: false,
};

export default function TemplateManagerModal({
	isOpen,
	onOpenChange,
	onCreated,
}: TemplateManagerModalProps) {
	const { data, isLoading } = useTemplates();
	const templates = data?.data ?? [];
	const { mutate: createTemplate, isPending: isCreating } = useCreateTemplate();
	const { mutate: updateTemplate, isPending: isUpdating } = useUpdateTemplate();
	const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate();

	// null: showing the list; otherwise the form
	const [draft, setDraft] = useState<Draft | null>(null);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) {
			setDraft(null);
			setConfirmDeleteId(null);
		}
	}, [isOpen]);

	// Preview of a newly picked picture
	useEffect(() => {
		if (!draft?.image) {
			setPreview(null);
			return undefined;
		}
		const url = URL.createObjectURL(draft.image);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [draft?.image]);

	const startEdit = (template: INotificationTemplate) =>
		setDraft({
			id: template._id,
			title: template.title,
			message: template.message,
			image: null,
			currentImage: template.image ?? null,
			removeImage: false,
		});

	const title = draft?.title.trim() ?? "";
	const message = draft?.message.trim() ?? "";
	const canSave = !!draft && title.length > 0 && message.length > 0 && !isCreating && !isUpdating;

	const save = (e: React.FormEvent) => {
		e.preventDefault();
		if (!draft || !canSave) return;
		const form = new FormData();
		form.append("title", title);
		form.append("message", message);
		if (draft.image) form.append("image", draft.image);
		else if (draft.removeImage) form.append("removeImage", "true");

		if (draft.id) {
			updateTemplate({ id: draft.id, data: form }, { onSuccess: () => setDraft(null) });
		} else {
			createTemplate(form, {
				onSuccess: (res) => {
					setDraft(null);
					if (res.success && res.data) onCreated?.(res.data);
				},
			});
		}
	};

	const shownImage = preview ?? (draft && !draft.removeImage ? draft.currentImage : null);

	let heading = "Notification templates";
	let saveLabel = "Create template";
	if (draft?.id) {
		heading = "Edit template";
		saveLabel = "Save changes";
	} else if (draft) {
		heading = "New template";
	}
	if (isCreating || isUpdating) saveLabel = "Saving...";

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white sm:max-w-[560px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">{heading}</DialogTitle>
					<DialogDescription>
						{draft
							? "The title and message are sent as they are written here."
							: "Saved messages you can send from Quick Notification in one click."}
					</DialogDescription>
				</DialogHeader>

				{draft ? (
					<form onSubmit={save} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="template-title">Title</Label>
							<Input
								id="template-title"
								value={draft.title}
								maxLength={TITLE_MAX}
								onChange={(e) => setDraft({ ...draft, title: e.target.value })}
								placeholder="e.g. Weekend free delivery"
								className="h-11"
								autoFocus
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="template-message">Message</Label>
								<span className="text-muted-foreground text-xs">
									{draft.message.length}/{MESSAGE_MAX}
								</span>
							</div>
							<Textarea
								id="template-message"
								value={draft.message}
								maxLength={MESSAGE_MAX}
								onChange={(e) => setDraft({ ...draft, message: e.target.value })}
								placeholder="What users will read"
								className="min-h-[140px] resize-none"
							/>
						</div>
						<div className="space-y-2">
							<Label>Picture (optional)</Label>
							<div className="flex items-center gap-3">
								{shownImage && (
									<div className="relative size-16 overflow-hidden rounded-lg border">
										<img
											src={shownImage}
											alt="Template"
											className="size-full object-cover"
										/>
									</div>
								)}
								<Button type="button" variant="outline" asChild>
									<label htmlFor="template-image" className="cursor-pointer">
										<Icon icon="lucide:image" className="mr-2" />
										{shownImage ? "Replace" : "Add picture"}
									</label>
								</Button>
								<input
									id="template-image"
									type="file"
									accept="image/*"
									className="hidden"
									aria-label="Template picture"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file)
											setDraft({ ...draft, image: file, removeImage: false });
										e.target.value = "";
									}}
								/>
								{shownImage && (
									<Button
										type="button"
										variant="ghost"
										className="text-destructive"
										onClick={() =>
											setDraft({ ...draft, image: null, removeImage: true })
										}
									>
										Remove
									</Button>
								)}
							</div>
						</div>
						<div className="flex gap-3 pt-2">
							<Button
								type="button"
								variant="ghost"
								className="flex-1"
								onClick={() => setDraft(null)}
							>
								Back
							</Button>
							<Button
								type="submit"
								disabled={!canSave}
								className="bg-secondary hover:bg-secondary/90 flex-[2] text-white"
							>
								{saveLabel}
							</Button>
						</div>
					</form>
				) : (
					<div className="space-y-4">
						<Button
							type="button"
							onClick={() => setDraft({ ...emptyDraft })}
							className="bg-secondary hover:bg-secondary/90 w-full text-white"
						>
							<Icon icon="lucide:plus" className="mr-2" />
							New template
						</Button>

						{isLoading && (
							<p className="text-muted-foreground text-sm">Loading templates...</p>
						)}
						{!isLoading && templates.length === 0 && (
							<p className="text-muted-foreground py-6 text-center text-sm">
								No templates yet. Create one to send it from Quick Notification.
							</p>
						)}

						<ul className="divide-border divide-y rounded-xl border">
							{templates.map((t) => (
								<li key={t._id} className="flex items-start gap-3 p-3">
									{t.image ? (
										<img
											src={t.image}
											alt=""
											className="size-10 shrink-0 rounded-md object-cover"
										/>
									) : (
										<div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
											<Icon
												icon="lucide:bell"
												className="text-muted-foreground"
											/>
										</div>
									)}
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-semibold">{t.title}</p>
										<p className="text-muted-foreground line-clamp-2 text-xs">
											{t.message}
										</p>
									</div>
									{confirmDeleteId === t._id ? (
										<div className="flex shrink-0 gap-1">
											<Button
												type="button"
												size="sm"
												variant="ghost"
												onClick={() => setConfirmDeleteId(null)}
											>
												Keep
											</Button>
											<Button
												type="button"
												size="sm"
												disabled={isDeleting}
												className="bg-destructive hover:bg-destructive/90 text-white"
												onClick={() =>
													deleteTemplate(t._id, {
														onSettled: () => setConfirmDeleteId(null),
													})
												}
											>
												Delete
											</Button>
										</div>
									) : (
										<div className="flex shrink-0 gap-1">
											<Button
												type="button"
												size="icon"
												variant="ghost"
												aria-label={`Edit template ${t.title}`}
												onClick={() => startEdit(t)}
											>
												<Icon icon="lucide:pencil" />
											</Button>
											<Button
												type="button"
												size="icon"
												variant="ghost"
												aria-label={`Delete template ${t.title}`}
												onClick={() => setConfirmDeleteId(t._id)}
											>
												<Icon
													icon="lucide:trash-2"
													className="text-destructive"
												/>
											</Button>
										</div>
									)}
								</li>
							))}
						</ul>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
