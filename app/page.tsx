import ListingsGrid from '@/components/ListingsGrid';
import { getAllListings } from '@/lib/services/getAllListings';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['allListings'],
    queryFn: getAllListings,
  });

  return (
    <div className='max-w-7xl p-2 sm:p-4 '>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ListingsGrid />
      </HydrationBoundary>
    </div>
  );
}
