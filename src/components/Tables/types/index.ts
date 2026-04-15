// src/components/Tables/types/index.ts
import { type ReactNode } from "react";

export type ColumnType =
	| "text"
	| "image"
	| "date"
	| "status"
	| "currency"
	| "action"
	| "truncate"
	| "custom";

export type BaseColumnSchema<T> = {
	key: keyof T | string;
	header: string;
	type?: ColumnType;
	width?: string;
	render?: (row: T) => ReactNode;
};
