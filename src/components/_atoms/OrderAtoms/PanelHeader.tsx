import React from "react";

export const PanelHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Icon Visual */}
      <div className="w-4 h-4 rounded-full border-[3px] border-primary" />
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
    </div>
  );
};