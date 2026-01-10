//src/hooks/useBaseStatsQuery.ts
"use client";

import {
  useQuery,
  type UseQueryOptions,
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";

// Export this type so it can be referenced in other files if needed
export type CustomQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error>,
  "queryKey" | "queryFn"
>;

export default function useBaseStatsQuery<TData>(
  queryKey: any[],
  queryFn: () => Promise<TData>,
  defaultData?: TData,
  queryOptions?: CustomQueryOptions<TData>
) {
  const query = useQuery<TData, Error>({
    queryKey,
    queryFn,
    ...queryOptions,
  });

  return {
    ...query,
    // If query.data is undefined (loading/error), fallback to defaultData
    data: query.data ?? defaultData,
    refresh: query.refetch as (
      options?: RefetchOptions
    ) => Promise<QueryObserverResult<TData, Error>>,
  };
}