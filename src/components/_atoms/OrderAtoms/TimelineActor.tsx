/* eslint-disable @typescript-eslint/no-unused-vars, import/prefer-default-export */
import React from "react";
import { Icon } from "@iconify/react";

interface TimelineActorProps {
	name: string;
	role: string;
	idLabel: string;
	idValue: string;
	time: string;
	isLast?: boolean;
}

export const TimelineActor: React.FC<TimelineActorProps> = ({
	name,
	role,
	idLabel,
	idValue,
	time,
	isLast = false,
}) => {
	return (
		<div className="relative flex gap-4 pb-8">
			{/* Vertical Line */}
			{!isLast && <div className="bg-border absolute bottom-0 left-[22px] top-10 w-[2px]" />}

			{/* Icon Avatar */}
			<div className="bg-muted border-border relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border">
				<Icon icon="lucide:image" className="text-muted-foreground size-5" />
			</div>

			{/* Content */}
			<div className="flex-1">
				<div className="flex items-start justify-between">
					<h4 className="text-foreground text-base font-semibold">{name}</h4>
					<span className="text-muted-foreground text-sm">{time}</span>
				</div>
				<div className="mt-1 flex items-center gap-2">
					<span className="text-muted-foreground text-xs">{idLabel}:</span>
					<span className="border-border bg-background text-foreground rounded border px-2 py-0.5 text-xs">
						{idValue}
					</span>
				</div>
			</div>
		</div>
	);
};

/* eslint-enable */
