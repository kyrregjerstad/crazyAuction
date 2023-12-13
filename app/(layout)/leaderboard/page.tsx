import { useServerJWT } from '@/lib/hooks/useServerJWT';
import { getAllUsers } from '@/lib/services/auction-api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import dynamic from 'next/dynamic';

const Leaderboard = dynamic(() => import('@/components/Leaderboard'), {
  ssr: true,
});

export default async function LeaderboardPage() {
  const queryClient = new QueryClient();
  const jwt = await useServerJWT();

  await queryClient.prefetchQuery({
    queryKey: ['allUsers'],
    queryFn: () => getAllUsers({ jwt }),
  });

  return (
    <div className='max-w-7xl p-2 sm:p-4'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Leaderboard />
      </HydrationBoundary>
    </div>
  );
}
