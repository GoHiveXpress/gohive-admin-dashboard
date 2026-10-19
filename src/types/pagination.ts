// src/types/pagination.ts
// Shape of `pagination` on admin list endpoints (gohive-backend/utils/pagination.js).

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	pagination: PaginationMeta;
}
