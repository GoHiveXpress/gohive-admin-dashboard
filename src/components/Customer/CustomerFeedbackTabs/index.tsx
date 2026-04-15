"use client";

import { Icon } from "@iconify/react";
import { useCustomerFeedback } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerFeedbackTab({ id }: { id: string }) {
  const { data: feedbackResponse, isLoading, error } = useCustomerFeedback(id);
  const feedbacks = feedbackResponse?.data;

  if (isLoading) {
    return (
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50 space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50 text-center text-destructive">
        Failed to load feedback.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50 space-y-3">
        {feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((item) => (
            <div key={item._id} className="p-4 bg-muted/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground">
                    {item.vendor?.vendorProfile?.businessName || "Vendor"}
                  </span>
                  <div className="flex items-center gap-1 text-[#FDB900]">
                    <Icon icon="ph:star-fill" />
                    <span className="text-foreground font-semibold">{item.rating.toFixed(1)}</span>
                  </div>
                </div>
                <span className="text-muted-foreground text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.comment}</p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No feedback found for this customer.
          </div>
        )}
    </div>
  );
}