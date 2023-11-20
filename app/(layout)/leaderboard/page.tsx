import Debugger from '@/components/Debugger';
import Leaderboard from '@/components/Leaderboard';
import ListingsGrid from '@/components/ListingsGrid';
import SearchFilters from '@/components/SearchFilters';
import { getAllListings, SearchParams } from '@/lib/services/getAllListings';
import { getAllUsers } from '@/lib/services/getAllUsers';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import authOptions from '../../auth/authOptions';

type Props = {
  searchParams?: SearchParams;
};

export default async function LeaderboardPage({ searchParams }: Props) {
  const { sort, order } = searchParams || {
    sort: 'endsAt',
    order: 'asc',
  };

  const queryClient = new QueryClient();
  const session = await getServerSession(authOptions);

  const jwt = session?.user.accessToken;

  await queryClient.prefetchQuery({
    queryKey: ['allUsers'],
    queryFn: () => getAllUsers({ jwt: session!.user!.accessToken! }),
  });

  return (
    <div className='max-w-7xl p-2 sm:p-4 '>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Leaderboard />
      </HydrationBoundary>
    </div>
  );
}
