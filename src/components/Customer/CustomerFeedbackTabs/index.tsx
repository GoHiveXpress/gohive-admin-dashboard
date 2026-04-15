"use client";

import { Icon } from "@iconify/react";
import { useCustomerFeedback } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerFeedbackTab({ id }: { id: string }) {
	const { data: feedbackResponse, isLoading, error } = useCustomerFeedback(id);
	const feedbacks = feedbackResponse?.data;

	if (isLoading) {
		return (
			<div className="border-border/50 space-y-4 rounded-[20px] border bg-white p-6 shadow-sm">
				<Skeleton className="h-20 w-full rounded-xl" />
				<Skeleton className="h-20 w-full rounded-xl" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="border-border/50 text-destructive rounded-[20px] border bg-white p-6 text-center shadow-sm">
				Failed to load feedback.
			</div>
		);
	}

	return (
		<div className="border-border/50 space-y-3 rounded-[20px] border bg-white p-6 shadow-sm">
			{feedbacks && feedbacks.length > 0 ? (
				feedbacks.map((item) => (
					<div key={item._id} className="bg-muted/20 rounded-xl p-4">
						<div className="mb-2 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<span className="text-foreground font-medium">
									{item.vendor?.vendorProfile?.businessName || "Vendor"}
								</span>
								<div className="flex items-center gap-1 text-[#FDB900]">
									<Icon icon="ph:star-fill" />
									<span className="text-foreground font-semibold">
										{item.rating.toFixed(1)}
									</span>
								</div>
							</div>
							<span className="text-muted-foreground text-xs">
								{new Date(item.createdAt).toLocaleDateString()}
							</span>
						</div>
						<p className="text-muted-foreground text-sm">{item.comment}</p>
					</div>
				))
			) : (
				<div className="text-muted-foreground p-8 text-center">
					No feedback found for this customer.
				</div>
			)}
		</div>
	);
}
