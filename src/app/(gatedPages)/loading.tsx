// src/app/(gatedPages)/loading.tsx
// Shown in the content area while a screen's code loads.
import { Skeleton } from "@/components/ui/skeleton";

export default function GatedPageLoading() {
	return (
		<div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading page">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[0, 1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-28 rounded-2xl" />
				))}
			</div>
			<Skeleton className="h-[420px] w-full rounded-2xl" />
		</div>
	);
}
