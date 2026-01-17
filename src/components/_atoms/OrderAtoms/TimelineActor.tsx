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
      {!isLast && (
        <div className="absolute left-[22px] top-10 bottom-0 w-[2px] bg-border" />
      )}

      {/* Icon Avatar */}
      <div className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-muted flex items-center justify-center border border-border">
        <Icon icon="lucide:image" className="text-muted-foreground w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-foreground text-base">{name}</h4>
          <span className="text-sm text-muted-foreground">{time}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{idLabel}:</span>
          <span className="text-xs border border-border rounded px-2 py-0.5 bg-background text-foreground">
            {idValue}
          </span>
        </div>
      </div>
    </div>
  );
};