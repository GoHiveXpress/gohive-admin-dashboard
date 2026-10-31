/* eslint-disable import/prefer-default-export */
import React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface StatusCheckProps {
	label: string;
	isChecked?: boolean;
	// Where the order stopped (rejected, cancelled, expired, payment failed)
	isFailed?: boolean;
	time?: string;
}

export const StatusCheck: React.FC<StatusCheckProps> = ({
	label,
	isChecked = false,
	isFailed = false,
	time,
}) => {
	return (
		<div
			className={cn(
				"bg-card mb-3 flex items-center justify-between rounded-lg border p-4 last:mb-0",
				isFailed ? "border-destructive/30 bg-destructive/5" : "border-border",
			)}
		>
			<div className="flex flex-col">
				<span
					className={cn(
						"text-sm font-medium",
						isFailed ? "text-destructive" : "text-foreground",
					)}
				>
					{label}
				</span>
				{time && <span className="text-muted-foreground text-xs">{time}</span>}
			</div>
			<div
				className={cn(
					"w-6 h-6 rounded-full flex items-center justify-center",
					isFailed && "bg-destructive text-white",
					!isFailed && isChecked && "bg-primary text-primary-foreground",
					!isFailed && !isChecked && "bg-muted text-muted-foreground",
				)}
			>
				{isFailed && <Icon icon="lucide:x" width="16" height="16" />}
				{!isFailed && isChecked && <Icon icon="lucide:check" width="16" height="16" />}
			</div>
		</div>
	);
};

/* eslint-enable */
