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
    queryKey: ['listings'],
    queryFn: getAllListings,
  });

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ListingsGrid />
      </HydrationBoundary>
    </main>
  );
}
