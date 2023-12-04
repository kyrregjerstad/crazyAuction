import ListingsGrid from '@/components/ListingsGrid';
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
  const { sort, order } = searchParams || {
    sort: 'endsAt',
    order: 'asc',
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['allListings', sort, order],
    queryFn: () =>
      getAllListings({
        sort: sort === 'endsAt' ? 'endsAt' : 'created',
        order,
      }),
  });

  return (
    <div className='w-full max-w-7xl p-2 sm:p-4'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchFilters sort={sort} order={order} />
        <ListingsGrid />
      </HydrationBoundary>
    </div>
  );
}
