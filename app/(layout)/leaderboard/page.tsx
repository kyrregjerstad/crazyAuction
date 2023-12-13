// import Leaderboard from '@/components/Leaderboard';
import dynamic from 'next/dynamic';
import { useServerJWT } from '@/lib/hooks/useServerJWT';
import { getAllUsers } from '@/lib/services/auction-api';
import { SearchParams } from '@/lib/services/auction-api/types';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

const Leaderboard = dynamic(() => import('@/components/Leaderboard'), {
  ssr: true,
});

type Props = {
  searchParams?: SearchParams;
};

export default async function LeaderboardPage({ searchParams }: Props) {
  const { sort, order } = searchParams || {
    sort: 'endsAt',
    order: 'asc',
  };

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
