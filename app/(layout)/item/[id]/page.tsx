import { getSingleListing } from '@/lib/services/getSingleListing';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import SingleListingPage from './Listing';

interface Props {
  params: { id: string };
}

const ItemDetailsPage = async ({ params: { id } }: Props) => {
  const session = await getServerSession();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['singleListing', id],
    queryFn: () => getSingleListing(id),
  });

  return (
    <div className='mx-auto max-w-5xl p-8'>
      <div className='grid items-start gap-8 md:grid-cols-2'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SingleListingPage listingId={id} />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default ItemDetailsPage;