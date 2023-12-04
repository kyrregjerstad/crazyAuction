import Leaderboard from '@/components/Leaderboard';
import { useServerJWT } from '@/lib/hooks/useServerJWT';
import getAllUsers from '@/lib/services/getAllUsers';
import { SearchParams } from '@/lib/services/types';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

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
    <div className='max-w-7xl p-2 sm:p-4 '>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Leaderboard />
      </HydrationBoundary>
    </div>
  );
}
