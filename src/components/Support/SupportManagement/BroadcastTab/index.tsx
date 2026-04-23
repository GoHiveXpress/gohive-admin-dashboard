import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { ICreateCommunicationRequest, UserRole } from "@/types/communication";
import { useCreateCommunication, useTemplates } from "@/hooks/communication";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function BroadcastTab() {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<ICreateCommunicationRequest>({
		defaultValues: {
			type: "broadcast",
			targetAudience: ["customer"],
		},
	});

	const { mutate: sendComposerBroadcast, isPending: isComposerPending } = useCreateCommunication();
	const { mutate: sendQuickBroadcast, isPending: isQuickPending } = useCreateCommunication();
	const { data: templatesData } = useTemplates();
	const templates = templatesData?.data || [];

	const [selectedQuickTemplate, setSelectedQuickTemplate] = useState<string>("");
	const [quickRoles, setQuickRoles] = useState<UserRole[]>(["customer"]);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [showLinkInput, setShowLinkInput] = useState(false);

	const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = (data: ICreateCommunicationRequest) => {
		const formData = new FormData();
		formData.append("subject", data.subject);
		formData.append("content", data.content);
		formData.append("type", data.type);
		data.targetAudience.forEach((role) => formData.append("targetAudience", role));
		if (data.ctaLink) formData.append("ctaLink", data.ctaLink);
		if (selectedImage) formData.append("image", selectedImage);

		sendComposerBroadcast(formData, {
			onSuccess: () => {
				reset();
				setSelectedImage(null);
				setImagePreview(null);
			},
		});
	};

	const handleTemplateSelect = (templateId: string) => {
		const template = templates.find((t) => t._id === templateId);
		if (template) {
			setValue("subject", template.title);
			setValue("content", template.message);
		}
	};

	const handleQuickSend = () => {
		const template = templates.find((t) => t._id === selectedQuickTemplate);
		if (!template) return;

		const formData = new FormData();
		formData.append("subject", template.title);
		formData.append("content", template.message);
		formData.append("type", "broadcast");
		if (template.image) formData.append("image", template.image);
		quickRoles.forEach((role) => formData.append("targetAudience", role));

		sendQuickBroadcast(formData, {
			onSuccess: () => setSelectedQuickTemplate(""),
		});
	};

	const toggleRole = (role: UserRole) => {
		setQuickRoles((prev) =>
			prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
		);
	};

	return (
		<div className="grid h-full grid-cols-12 items-start gap-6">
			{/* === LEFT: Message Composer === */}
			<div className="col-span-8 space-y-6">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="bg-card border-border rounded-xl border p-6 shadow-sm"
				>
					<div className="mb-6 flex items-center gap-2">
						<div className="border-primary size-4 rounded-full border-[3px]" />
						<h3 className="text-xl font-semibold">Message Composer</h3>
					</div>

					{/* Form */}
					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-lg font-medium">Subject</label>
							<Input
								{...register("subject", { required: "Subject is required" })}
								placeholder="Subject"
								className={`h-12 bg-transparent ${errors.subject ? "border-destructive" : ""}`}
							/>
							{errors.subject && (
								<p className="text-destructive text-sm">{errors.subject.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-lg font-medium">Message</label>
							<div className="relative">
								<Textarea
									{...register("content", { required: "Message content is required" })}
									placeholder="Type Message"
									className={`min-h-[160px] resize-none bg-transparent p-4 ${
										errors.content ? "border-destructive" : ""
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
							{errors.content && (
								<p className="text-destructive text-sm">{errors.content.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-lg font-medium">Target Audience</label>
							<div className="flex flex-wrap gap-4 pt-2">
								{["customer", "vendor", "rider"].map((role) => (
									<div key={role} className="flex items-center gap-2">
										<Checkbox
											id={`composer-${role}`}
											checked={(watch("targetAudience") || []).includes(role as UserRole)}
											onCheckedChange={(checked) => {
												const current = watch("targetAudience") || [];
												if (checked) {
													setValue("targetAudience", [...current, role as UserRole]);
												} else {
													setValue(
														"targetAudience",
														current.filter((r) => r !== role),
													);
												}
											}}
										/>
										<label
											htmlFor={`composer-${role}`}
											className="text-sm font-medium capitalize"
										>
											{role}s
										</label>
									</div>
								))}
							</div>
						</div>

						<div className="flex items-center gap-4 pt-4">
							<div className="flex gap-2">
								<div className="relative">
									<input
										type="file"
										id="image-upload"
										className="hidden"
										accept="image/*"
										onChange={onImageSelect}
									/>
									<Button
										type="button"
										size="icon"
										asChild
										className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
									>
										<label htmlFor="image-upload" className="cursor-pointer">
											<Icon icon="lucide:image" />
										</label>
									</Button>
								</div>
								<Button
									type="button"
									size="icon"
									className={`${showLinkInput ? "bg-secondary" : "bg-primary"} text-white rounded-full`}
									onClick={() => setShowLinkInput(!showLinkInput)}
								>
									<Icon icon="lucide:link" />
								</Button>
							</div>

							<div className="relative flex flex-1 items-center justify-center gap-4">
								{showLinkInput && (
									<div className="flex-1 max-w-[300px]">
										<Input
											{...register("ctaLink")}
											placeholder="https://example.com"
											className="h-10 bg-transparent border-primary/50 focus:border-primary"
										/>
									</div>
								)}
								<Button
									type="submit"
									disabled={isComposerPending}
									className="bg-secondary hover:bg-secondary/90 h-12 w-48 px-8 text-base text-white"
								>
									{isComposerPending ? "Sending..." : "Send Now"}
								</Button>
								{/* <Button
									type="button"
									variant="secondary"
									className="bg-muted text-foreground hover:bg-muted/80 h-12 w-48 px-8 text-base"
								>
									Schedule Broadcast
								</Button> */}
							</div>
						</div>
					</div>
				</form>

				{/* Analytics */}
				{/* <div className="bg-transparent p-4">
					<div className="mb-4 flex items-center gap-2">
						<div className="border-primary size-4 rounded-full border-[3px]" />
						<h3 className="text-xl font-semibold">Analytics</h3>
					</div>
					<div className="max-w-md space-y-2">
						<div className="flex justify-between text-base">
							<span className="font-medium">Delivery success rate</span>
							<span className="text-muted-foreground text-sm">0%</span>
						</div>
						<div className="flex justify-between text-base">
							<span className="font-medium">Open rate</span>
							<span className="text-muted-foreground text-sm">0%</span>
						</div>
						<div className="flex justify-between text-base">
							<span className="font-medium">Click-through rate</span>
							<span className="text-muted-foreground text-sm">0%</span>
						</div>
					</div>
				</div> */}
			</div>

			{/* === RIGHT: Quick Notification === */}
			<div className="col-span-4">
				<div className="bg-card border-border h-fit rounded-xl border p-6 shadow-sm">
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="border-primary size-4 rounded-full border-[3px]" />
							<h3 className="text-xl font-semibold">Quick Notification</h3>
						</div>
						<Icon icon="lucide:more-vertical" className="cursor-pointer" />
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-base font-medium">Template</label>
							<Select
								value={selectedQuickTemplate}
								onValueChange={setSelectedQuickTemplate}
							>
								<SelectTrigger className="h-12 bg-transparent">
									<SelectValue placeholder="Select Template" />
								</SelectTrigger>
								<SelectContent className="z-[9999] bg-white">
									{templates.map((t) => (
										<SelectItem key={t._id} value={t._id}>
											{t.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-base font-medium">Target Audience</label>
							<div className="flex flex-col gap-3 pt-1">
								{["customer", "vendor", "rider"].map((role) => (
									<div key={role} className="flex items-center gap-2">
										<Checkbox
											id={`quick-${role}`}
											checked={quickRoles.includes(role as UserRole)}
											onCheckedChange={() => toggleRole(role as UserRole)}
										/>
										<label
											htmlFor={`quick-${role}`}
											className="text-sm font-medium capitalize"
										>
											{role}s
										</label>
									</div>
								))}
							</div>
						</div>

						<Button
							onClick={handleQuickSend}
							disabled={isQuickPending || !selectedQuickTemplate || quickRoles.length === 0}
							className="bg-secondary hover:bg-secondary/90 h-12 w-full text-base font-medium text-white shadow-lg transition-all active:scale-[0.98]"
						>
							{isQuickPending ? "Sending..." : "Send Notification"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
