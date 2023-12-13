import AllListingsGrid from '@/components/ListingsGrid';
import SearchFilters from '@/components/SearchFilters';
import { searchOrderOptions, searchSortOptions } from '@/lib/constants';
import { getAuctions } from '@/lib/services/auction-api';
import { SearchParams } from '@/lib/services/auction-api/types';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { pageMetaData } from '@/lib/data/metadata';

type Props = {
  searchParams?: SearchParams;
};

export default async function HomePage({ searchParams }: Props) {
  const { sort = 'endsAt', order = 'asc' } = searchParams || {};

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['allListingsInfinite', sort, order],
    queryFn: () =>
      getAuctions({
        sort: sort === 'endsAt' ? 'endsAt' : 'created',
        sortOrder: order,
        limit: 100,
        offset: 0,
      }),
    initialPageParam: 0,
  });

  return (
    <div className='w-full max-w-7xl p-2 sm:p-4'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchFilters
          searchParams={{ sort, order }}
          sortOptions={searchSortOptions}
          orderOptions={searchOrderOptions}
        />
        <AllListingsGrid />
      </HydrationBoundary>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata: Metadata = {
  ...pageMetaData,
  title: 'CrazyAuction | Home',
};
