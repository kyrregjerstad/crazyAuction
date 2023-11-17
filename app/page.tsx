import ListingsGrid from '@/components/ListingsGrid';
import { getAllListings } from '@/lib/services/getAllListings';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

export default async function HomePage() {
  const queryClient = new QueryClient();

  const session = await getServerSession();

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
