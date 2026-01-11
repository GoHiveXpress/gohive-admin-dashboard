"use client";

import { Icon } from "@iconify/react";

export default function CustomerFeedbackTab() {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/50">
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl mb-3">
            <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">Mama Foodie</span>
                <div className="flex items-center gap-1 text-[#FDB900]">
                    <Icon icon="ph:star-fill" />
                    <span className="text-foreground font-semibold">5.0</span>
                </div>
            </div>
            <span className="text-muted-foreground text-sm">Mama Foodie</span>
        </div>
        {/* Add more feedback items here */}
    </div>
  );
}