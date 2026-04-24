// src/components/_modals/EditVendorCategoryModal/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useUpdateVendorCategory } from "@/hooks/useVendorCategories";
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
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IVendorCategory } from "@/types/vendorManagement/vendorCategory";

const PRESET_COLORS = [
	"#4CAF50", "#2196F3", "#F44336", "#FF9800", 
	"#9C27B0", "#00BCD4", "#E91E63", "#FFEB3B",
	"#795548", "#607D8B", "#17110A", "#FFFFFF"
];

interface EditVendorCategoryModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	category: IVendorCategory | null;
}

export default function EditVendorCategoryModal({ isOpen, onOpenChange, category }: EditVendorCategoryModalProps) {
	const updateMutation = useUpdateVendorCategory();
	const [formData, setFormData] = useState({
		title: "",
		subtitle: "",
		value: "",
		backgroundColor: "#4CAF50",
		image: null as File | null,
	});

	useEffect(() => {
		if (category) {
			setFormData({
				title: category.title,
				subtitle: category.subtitle,
				value: category.value,
				backgroundColor: category.backgroundColor,
				image: null,
			});
		}
	}, [category]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const validTypes = ["image/png", "image/jpeg", "image/jpg"];
			if (!validTypes.includes(file.type)) {
				alert("Only PNG, JPEG and JPG files are accepted.");
				return;
			}
			setFormData({ ...formData, image: file });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!category) return;

		const data = new FormData();
		data.append("title", formData.title);
		data.append("subtitle", formData.subtitle);
		data.append("value", formData.value);
		data.append("backgroundColor", formData.backgroundColor);
		if (formData.image) {
			data.append("image", formData.image);
		}

		updateMutation.mutate({ id: category._id, formData: data }, {
			onSuccess: () => {
				onOpenChange(false);
			},
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] overflow-hidden rounded-[24px] border-none p-0 shadow-2xl">
				<div className="bg-secondary/10 flex h-24 items-center px-8">
					<div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg shadow-secondary/20">
						<Icon icon="ph:pencil-line-duotone" className="size-7 text-white" />
					</div>
					<div className="ml-4">
						<DialogHeader className="p-0 text-left">
							<DialogTitle className="text-xl font-bold text-[#17110A]">Edit Business Type</DialogTitle>
							<DialogDescription className="sr-only">
								Modify the details of an existing business type category.
							</DialogDescription>
						</DialogHeader>
						<p className="text-xs font-medium text-muted-foreground/80">Update the classification details</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6 p-8">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type Title</Label>
								<Input
									id="title"
									placeholder="e.g. Restaurant"
									className="h-11 rounded-xl border-gray-200 bg-gray-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-secondary/20"
									value={formData.title}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="value" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Internal Code</Label>
								<Input
									id="value"
									placeholder="RESTAURANT"
									className="h-11 rounded-xl border-gray-200 bg-gray-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-secondary/20"
									value={formData.value}
									onChange={(e) => setFormData({ ...formData, value: e.target.value })}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subtitle" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</Label>
							<Input
								id="subtitle"
								placeholder="e.g. For food and beverage vendors"
								className="h-11 rounded-xl border-gray-200 bg-gray-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-secondary/20"
								value={formData.subtitle}
								onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Theme Color</Label>
								<Popover>
									<PopoverTrigger asChild>
										<button 
											type="button"
											className="flex h-11 w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-3 transition-all hover:bg-white"
										>
											<div 
												className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200" 
												style={{ backgroundColor: formData.backgroundColor }}
											/>
											<span className="font-mono text-xs text-muted-foreground">{formData.backgroundColor}</span>
										</button>
									</PopoverTrigger>
									<PopoverContent className="w-[280px] space-y-4 rounded-2xl p-4 shadow-xl border-none">
										<HexColorPicker 
											color={formData.backgroundColor} 
											onChange={(color) => setFormData({ ...formData, backgroundColor: color })} 
											className="!w-full"
										/>
										<div className="grid grid-cols-6 gap-2">
											{PRESET_COLORS.map((color) => (
												<button
													key={color}
													type="button"
													className={cn(
														"h-7 w-7 rounded-lg border-2 border-white shadow-sm ring-1 ring-gray-200 transition-transform active:scale-90",
														formData.backgroundColor === color && "ring-secondary scale-110"
													)}
													style={{ backgroundColor: color }}
													onClick={() => setFormData({ ...formData, backgroundColor: color })}
												/>
											))}
										</div>
										<Input
											value={formData.backgroundColor}
											onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
											className="h-9 rounded-lg border-gray-200 text-xs font-mono"
											placeholder="#FFFFFF"
										/>
									</PopoverContent>
								</Popover>
							</div>

							<div className="space-y-2">
								<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visual Preview</Label>
								<div className="flex justify-center">
									<div 
										className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-white shadow-lg ring-1 ring-gray-200 transition-all"
										style={{ backgroundColor: formData.backgroundColor }}
									>
										{formData.image ? (
											<img 
												src={URL.createObjectURL(formData.image)} 
												alt="Preview" 
												className="h-12 w-12 object-contain" 
											/>
										) : (
											<img 
												src={category?.imageUrl} 
												alt="Preview" 
												className="h-12 w-12 object-contain" 
											/>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Icon</Label>
							<label 
								htmlFor="image-edit" 
								className={cn(
									"flex cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed transition-all",
									formData.image ? "bg-secondary/5 border-secondary/30 py-4" : "border-gray-200 bg-gray-50/50 py-8 hover:bg-gray-100/50 hover:border-gray-300"
								)}
							>
								{formData.image ? (
									<div className="flex items-center gap-3 px-4">
										<div className="bg-secondary/20 flex h-10 w-10 items-center justify-center rounded-xl">
											<Icon icon="ph:check-circle-fill" className="size-6 text-secondary" />
										</div>
										<div className="flex flex-col overflow-hidden text-left">
											<span className="truncate text-sm font-bold text-[#17110A]">{formData.image.name}</span>
											<span className="text-[10px] text-muted-foreground">Click to replace icon</span>
										</div>
									</div>
								) : (
									<>
										<div className="bg-white mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1 ring-gray-200">
											<Icon icon="ph:image-duotone" className="size-7 text-secondary" />
										</div>
										<span className="text-sm font-bold text-[#17110A]">Update Category Icon</span>
										<span className="mt-1 text-[11px] text-muted-foreground">PNG, JPEG or JPG (Max 2MB)</span>
									</>
								)}
								<input 
									id="image-edit" 
									type="file" 
									accept=".png,.jpeg,.jpg" 
									onChange={handleFileChange} 
									className="hidden" 
								/>
							</label>
						</div>
					</div>

					<div className="flex items-center gap-3 pt-2">
						<Button 
							type="button" 
							variant="ghost" 
							className="h-12 flex-1 rounded-2xl font-bold text-muted-foreground hover:bg-gray-100"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button 
							type="submit" 
							className="bg-secondary h-12 flex-[2] rounded-2xl font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:shadow-xl active:scale-95" 
							disabled={updateMutation.isPending}
						>
							{updateMutation.isPending ? (
								<Icon icon="line-md:loading-twotone-loop" className="mr-2 size-5" />
							) : (
								<Icon icon="ph:check-bold" className="mr-2 size-5" />
							)}
							Save Changes
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
