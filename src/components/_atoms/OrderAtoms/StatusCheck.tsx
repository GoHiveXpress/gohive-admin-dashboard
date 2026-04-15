/* eslint-disable import/prefer-default-export */
import React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface StatusCheckProps {
	label: string;
	isChecked?: boolean;
}

export const StatusCheck: React.FC<StatusCheckProps> = ({ label, isChecked = false }) => {
	return (
		<div className="border-border bg-card mb-3 flex items-center justify-between rounded-lg border p-4 last:mb-0">
			<span className="text-foreground text-sm font-medium">{label}</span>
			<div
				className={cn(
					"w-6 h-6 rounded-full flex items-center justify-center",
					isChecked
						? "bg-primary text-primary-foreground"
						: "bg-muted text-muted-foreground",
				)}
			>
				{isChecked && <Icon icon="lucide:check" width="16" height="16" />}
			</div>
		</div>
	);
};

/* eslint-enable */
