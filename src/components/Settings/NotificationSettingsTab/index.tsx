"use client";

/* eslint-disable react/no-array-index-key */

import React, {useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { useTemplates, useCreateTemplate, useDeleteTemplate } from "@/hooks/communication";
import { useForm } from "react-hook-form";
import { ICreateTemplateRequest } from "@/types/communication";

export default function NotificationSettingsTab() {
	const { data: templatesData, isLoading } = useTemplates();
	const { mutate: createTemplate, isPending: isCreating } = useCreateTemplate();
	const { mutate: deleteTemplate } = useDeleteTemplate();

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ICreateTemplateRequest>();

	const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = (data: ICreateTemplateRequest) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("message", data.message);
		if (selectedImage) formData.append("image", selectedImage);

		createTemplate(formData, {
			onSuccess: () => {
				reset();
				setSelectedImage(null);
				setImagePreview(null);
			},
		});
	};

	const templates = templatesData?.data || [];

	return (
		<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
			{/* Left: Add Notification */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="border-border flex h-full flex-col rounded-[24px] border bg-white p-8 shadow-sm"
			>
				<div className="mb-8 flex items-center gap-2">
					<Icon icon="ph:circle-fill" className="text-primary size-5" />
					<h3 className="text-foreground text-xl font-medium">Add Notification</h3>
				</div>

				<div className="flex-1 space-y-6">
					<div className="space-y-2">
						<label className="text-base font-medium">Title</label>
						<Input
							{...register("title", { required: "Title is required" })}
							placeholder="e.g (system outage)"
							className={`border-border h-14 rounded-xl bg-white ${
								errors.title ? "border-destructive" : ""
							}`}
						/>
						{errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
					</div>

					<div className="space-y-2">
						<label className="text-base font-medium">Message</label>
						<div className="relative">
							<Textarea
								{...register("message", { required: "Message content is required" })}
								placeholder="Input text"
								className={`border-border min-h-[200px] resize-none rounded-xl bg-white p-4 ${
									errors.message ? "border-destructive" : ""
								}`}
							/>
							{imagePreview && (
								<div className="absolute bottom-4 right-4">
									<div className="relative h-20 w-20 overflow-hidden rounded-lg border">
										<img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
										<button
											type="button"
											onClick={() => {
												setSelectedImage(null);
												setImagePreview(null);
											}}
											className="bg-destructive absolute right-0 top-0 flex h-5 w-5 items-center justify-center text-white"
										>
											<Icon icon="lucide:x" className="size-3" />
										</button>
									</div>
								</div>
							)}
						</div>
						{errors.message && (
							<p className="text-destructive text-sm">{errors.message.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-base font-medium">Attachment</label>
						<div className="relative">
							<input
								type="file"
								id="template-image-upload"
								className="hidden"
								accept="image/*"
								onChange={onImageSelect}
							/>
							<Button
								type="button"
								variant="outline"
								asChild
								className="border-border h-14 w-full justify-start gap-2 rounded-xl bg-white px-4 text-muted-foreground"
							>
								<label htmlFor="template-image-upload" className="cursor-pointer">
									<Icon icon="lucide:image" className="size-5" />
									{selectedImage ? selectedImage.name : "Upload Image (Optional)"}
								</label>
							</Button>
						</div>
					</div>
				</div>

				<Button
					type="submit"
					disabled={isCreating}
					className="bg-secondary hover:bg-secondary/90 mt-8 h-12 w-full rounded-lg text-base font-medium text-white"
				>
					{isCreating ? "Adding..." : "Add Template"}
				</Button>
			</form>

			{/* Right: Notifications List */}
			<div className="border-border h-full min-h-[500px] rounded-[24px] border bg-white p-8 shadow-sm">
				<div className="border-border mb-8 flex items-center gap-2 border-b pb-4">
					<Icon icon="ph:circle-fill" className="text-primary size-5" />
					<h3 className="text-foreground text-xl font-medium">Notifications</h3>
				</div>

				<div className="custom-scrollbar h-[400px] space-y-6 overflow-y-auto pr-2">
					{isLoading ? (
						<div className="text-muted-foreground text-center py-10">Loading templates...</div>
					) : templates.length === 0 ? (
						<div className="text-muted-foreground text-center py-10">No templates found</div>
					) : (
						templates.map((template) => (
							<div
								key={template._id}
								className="group flex items-center justify-between border-b border-gray-50 pb-4 last:border-0"
							>
								<div className="flex items-center gap-3">
									<span className="bg-destructive size-1.5 rounded-full" />
									<div className="flex flex-col">
										<span className="text-foreground text-lg font-medium">{template.title}</span>
										<span className="text-muted-foreground line-clamp-1 text-sm">
											{template.message}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteTemplate(template._id)}
										className="text-destructive hover:text-destructive/80"
									>
										<Icon icon="lucide:trash-2" className="size-5" />
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
