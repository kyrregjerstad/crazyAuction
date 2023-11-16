'use client';
import BidBox from '@/components/BidBox';
import ImageGallery from '@/components/ImageGallery';
import { Listing } from '@/lib/schemas/listing';
import { getSingleListing } from '@/lib/services/getSingleListing';
import { useQuery } from '@tanstack/react-query';

const Listing = ({ listingId }: { listingId: string }) => {
  const { data: listing, isLoading } = useQuery<Listing>({
    queryKey: ['listing', listingId],
    queryFn: () => getSingleListing({ id: listingId }),
    refetchInterval: 1000 * 10, // 10 seconds
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>No listing found</div>;
  }

  const currentBid = listing.bids.at(-1)?.amount || 0;
  return (
    <>
      <ImageGallery images={listing.media} />
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>{listing.title}</h1>
        <div className='text-5xl font-bold text-white'>
          Current Bid: ${currentBid}
        </div>
        <BidBox listingId={listingId} currentBid={currentBid} />
        <p className='text-lg'>{listing.description}</p>
        <div className='rounded-lg bg-zinc-800/50 p-6'>
          <h2 className='text-xl font-semibold'>Seller Information</h2>
          <div className='mt-4 flex items-center'>
            <svg
              className=' mr-2 h-8 w-8'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
              <circle cx='12' cy='7' r='4' />
            </svg>
            <span className='font-medium'>{listing.seller.name}</span>
          </div>
          <div className='mt-2 flex items-center'>
            <svg
              className=' h-6 w-6 fill-accent'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <polyline points='20 6 9 17 4 12' />
            </svg>
            <span className='ml-2'>Verified Seller</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Listing;
