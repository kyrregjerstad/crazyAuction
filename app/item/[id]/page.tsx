import BidBox from '@/components/BidBox';
import ImageGallery from '@/components/ImageGallery';
import useGetSingleAuctionItem from '@/lib/hooks/useGetSingleAuctionItem';
import { getServerSession } from 'next-auth';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getSingleListing } from '@/lib/services/getSingleListing';
import Listing from './Listing';

interface Props {
  params: { id: string };
}

const ItemDetailsPage = async ({ params }: Props) => {
  const session = await getServerSession();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['listing', params.id],
    queryFn: () => getSingleListing({ id: params.id }),
  });

  return (
    <div className='mx-auto max-w-5xl p-8'>
      <div className='grid items-start gap-8 md:grid-cols-2'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Listing listingId={params.id} />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
