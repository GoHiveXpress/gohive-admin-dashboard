import React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface StatusCheckProps {
  label: string;
  isChecked?: boolean;
}

export const StatusCheck: React.FC<StatusCheckProps> = ({
  label,
  isChecked = false,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card mb-3 last:mb-0">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center",
          isChecked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        {isChecked && <Icon icon="lucide:check" width="16" height="16" />}
      </div>
    </div>
  );
};