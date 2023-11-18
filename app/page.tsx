import ListingsGrid from '@/components/ListingsGrid';
import SearchFilters from '@/components/SearchFilters';
import { getAllListings, SearchParams } from '@/lib/services/getAllListings';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

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
    queryKey: ['allListings'],
    queryFn: () =>
      getAllListings({
        sort,
        order,
      }),
  });

  return (
    <div className='max-w-7xl p-2 sm:p-4 '>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchFilters sort={sort} order={order} />
        <ListingsGrid />
      </HydrationBoundary>
    </div>
  );
}
