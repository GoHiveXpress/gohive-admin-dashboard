/* eslint-disable import/prefer-default-export */
import React from "react";

export const PanelHeader: React.FC<{ title: string }> = ({ title }) => {
	return (
		<div className="mb-4 flex items-center gap-2">
			{/* Icon Visual */}
			<div className="border-primary size-4 rounded-full border-[3px]" />
			<h3 className="text-foreground text-lg font-semibold">{title}</h3>
		</div>
	);
};

/* eslint-enable */
