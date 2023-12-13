import { getSingleAuction } from '@/lib/services/auction-api/getSingleAuction';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth/next';
import SingleListingPage from './Listing';
import authOptions from '@/app/(auth)/authOptions';

interface Props {
  params: { id: string };
}

const ItemDetailsPage = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['singleListing', id],
    queryFn: () => getSingleAuction(id),
  });

  return (
    <div className='mx-auto max-w-5xl p-8'>
      <div className='grid items-start gap-8 md:grid-cols-2'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SingleListingPage
            listingId={id}
            isAuthenticated={!!session?.user.name}
          />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
