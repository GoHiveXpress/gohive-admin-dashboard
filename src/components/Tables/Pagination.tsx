// src/components/Tables/Pagination.tsx
// Prev/next controls for server-paginated tables.

"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { type PaginationMeta } from "@/types/pagination";

interface TablePaginationProps {
	pagination?: PaginationMeta;
	onPageChange: (page: number) => void;
	isFetching?: boolean;
	itemLabel?: string;
}

export default function TablePagination({
	pagination,
	onPageChange,
	isFetching = false,
	itemLabel = "results",
}: TablePaginationProps) {
	if (!pagination) return null;

	const { page, limit, total, totalPages, hasNextPage } = pagination;
	const first = total === 0 ? 0 : (page - 1) * limit + 1;
	const last = Math.min(page * limit, total);

	return (
		<div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm">
			<span className="text-muted-foreground">
				{total === 0
					? `No ${itemLabel}`
					: `Showing ${first}–${last} of ${total.toLocaleString()} ${itemLabel}`}
			</span>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page - 1)}
					disabled={page <= 1 || isFetching}
					aria-label="Previous page"
				>
					<Icon icon="ph:caret-left" className="size-4" />
				</Button>
				<span className="text-foreground min-w-[90px] text-center font-medium">
					Page {page} of {totalPages}
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page + 1)}
					disabled={!hasNextPage || isFetching}
					aria-label="Next page"
				>
					<Icon icon="ph:caret-right" className="size-4" />
				</Button>
			</div>
		</div>
	);
}
