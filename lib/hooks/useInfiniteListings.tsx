'use client';
import useSortSearchParams from '@/lib/hooks/useSortSearchParams';
import { getAuctions } from '@/lib/services/auction-api';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteListings = () => {
  const { sort, order } = useSortSearchParams();

  return useInfiniteQuery({
    queryKey: ['allListingsInfinite', sort, order],
    queryFn: ({ pageParam = 0 }) =>
      getAuctions({
        sort,
        sortOrder: order,
        limit: 100,
        offset: pageParam * 100,
      }),
    initialPageParam: 0,
    refetchInterval: 1000 * 30, // 30 seconds
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 0) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
};
