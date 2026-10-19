// src/hooks/useGlobalSearch.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { searchApi } from "@/app/api/search";
import { useDebounce } from "@/hooks/useDebounce";

export const MIN_SEARCH_LENGTH = 2;

export function useGlobalSearch(query: string, enabled = true) {
	const term = useDebounce(query.trim(), 250);
	const ready = enabled && term.length >= MIN_SEARCH_LENGTH;

	const result = useQuery({
		queryKey: ["global-search", term],
		queryFn: () => searchApi.search(term),
		enabled: ready,
		placeholderData: keepPreviousData,
		staleTime: 30_000,
	});

	return { ...result, term, ready };
}
