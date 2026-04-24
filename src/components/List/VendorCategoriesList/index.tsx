// src/components/List/VendorCategoriesList/index.tsx
"use client";

import React from "react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { getVendorCategoryColumns, type VendorCategoryData } from "@/components/Tables/columns/VendorCategoryColumns";
import { useVendorCategories, useDeleteVendorCategory } from "@/hooks/useVendorCategories";
import { Loader2 } from "lucide-react";

import EditVendorCategoryModal from "@/components/_modals/EditVendorCategoryModal";
import { IVendorCategory } from "@/types/vendorManagement/vendorCategory";

export default function VendorCategoriesList() {
	const { data: categoriesData, isLoading } = useVendorCategories();
	const deleteMutation = useDeleteVendorCategory();

	const [isEditOpen, setIsEditOpen] = React.useState(false);
	const [selectedCategory, setSelectedCategory] = React.useState<IVendorCategory | null>(null);

	const handleActionDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	const handleActionEdit = (row: VendorCategoryData) => {
		const category = categoriesData?.data.find(c => c._id === row.id);
		if (category) {
			setSelectedCategory(category);
			setIsEditOpen(true);
		}
	};

	const tableData: VendorCategoryData[] = categoriesData?.data?.map((cat) => ({
		id: cat._id,
		image: cat.imageUrl,
		title: cat.title,
		subtitle: cat.subtitle,
		value: cat.value,
		color: cat.backgroundColor,
	})) || [];

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="text-secondary size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="w-full">
			<DataTable 
				columns={getColumns(getVendorCategoryColumns(handleActionDelete, handleActionEdit))} 
				data={tableData} 
				title="" 
			/>

			<EditVendorCategoryModal 
				isOpen={isEditOpen} 
				onOpenChange={setIsEditOpen} 
				category={selectedCategory} 
			/>
		</div>
	);
}
