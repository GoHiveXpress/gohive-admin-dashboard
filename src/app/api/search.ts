// src/app/api/search.ts
/* eslint-disable import/prefer-default-export */
import { apiClient } from "@/lib/apiClient";
import { type GlobalSearchResponse } from "@/types/search";

export const searchApi = {
	search: (query: string) =>
		apiClient.get<GlobalSearchResponse>(
			`/admin/search?q=${encodeURIComponent(query)}`,
			"Search failed",
		),
};

/* eslint-enable */
