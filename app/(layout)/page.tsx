import AllListingsGrid from '@/components/ListingsGrid';
import SearchFilters from '@/components/SearchFilters';
import { getAllListings } from '@/lib/services/getAllListings';
import { SearchParams } from '@/lib/services/types';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

type Props = {
  searchParams?: SearchParams;
};

export default async function HomePage({ searchParams }: Props) {
  const { sort = 'endsAt', order = 'asc' } = searchParams || {};

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['allListings', sort, order],
    queryFn: () =>
      getAllListings({
        sort: sort === 'endsAt' ? 'endsAt' : 'created',
        order,
        limit: 100,
        offset: 0,
      }),
    initialPageParam: 0,
  });

  return (
    <div className='w-full max-w-7xl p-2 sm:p-4'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchFilters sort={sort} order={order} />
        <AllListingsGrid />
      </HydrationBoundary>
    </div>
  );
}
