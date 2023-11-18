'use client';
import BidBox from '@/components/BidBox';
import ImageGallery from '@/components/ImageGallery';
import { Bid } from '@/lib/schemas/listing';
import { getSingleListing } from '@/lib/services/getSingleListing';
import { useMutationState, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ScrollArea } from '@/components/ui/scroll-area';

import Link from 'next/link';

dayjs.extend(relativeTime);

const SingleListingPage = ({ listingId }: { listingId: string }) => {
  const { data: singleListing, isLoading } = useQuery({
    queryKey: ['singleListing', listingId],
    queryFn: () => getSingleListing(listingId),
    refetchInterval: 1000 * 10, // 10 seconds
  });

  const variables = useMutationState({
    filters: { mutationKey: ['currentBid'], status: 'pending' },
    select: (mutation) => mutation.state.variables,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleListing) {
    return <div>No listing found</div>;
  }

  const { title, description, seller, media, bids } = singleListing;

  const currentBid = singleListing.bids?.at(-1)?.amount || 0;
  return (
    <>
      <ImageGallery images={media} />
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        <div className='text-5xl font-bold text-white'>
          Current Bid: ${currentBid}
        </div>
        <BidBox listingId={listingId} currentBid={currentBid} />
        <p className='text-lg'>{description}</p>
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
            <span className='font-medium'>
              <Link href={`/user/${seller.name}`}>{seller.name}</Link>
            </span>
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
        <BidHistory bids={bids} />
      </div>
    </>
  );
};

export default SingleListingPage;

function BidHistory({ bids }: { bids?: Bid[] }) {
  if (!bids || bids.length === 0) {
    return (
      <div className='w-full max-w-md rounded-lg p-6 text-foreground'>
        <h2 className='mb-6 text-lg font-semibold text-accent'>Bid History</h2>
        <div className='relative m-3 leading-loose'>
          <div className='absolute left-[10px] top-2 h-full w-[2px]  bg-gradient-to-b from-accent' />
          <div className='flex h-32 items-center justify-center'>
            <p className='text-gray-400'>No bids yet</p>
          </div>
        </div>
      </div>
    );
  }
  const reversedBids = bids.toReversed(); // get the most recent bids first
  return (
    <div className='w-full max-w-md rounded-lg p-6 text-foreground'>
      <h2 className='mb-6 text-lg font-semibold text-accent'>Bid History</h2>
      <div className='relative m-3 leading-loose'>
        <div className='absolute left-[10px] top-2 h-full w-[2px]  bg-gradient-to-b from-accent' />
        <ScrollArea className='h-96'>
          <ul className='list-none'>
            {reversedBids.map((bid, index) => (
              <BidHistoryItem key={bid.id} bid={bid} index={index} />
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}

function BidHistoryItem({ bid, index }: { bid: Bid; index: number }) {
  const { created, amount, bidderName } = bid;
  const bidDate = dayjs(created).fromNow();
  return (
    <li className='mb-3'>
      <div className={`mb-1 flex items-center`}>
        <div
          className={`${
            index === 0 ? 'bg-accent' : 'bg-gray-600'
          } z-10 h-6 w-6 rounded-full`}
        />
        <div className='ml-4 flex-1 font-medium'>{bidDate}</div>
      </div>
      <div className='ml-12'>
        <h3 className='font-semibold'>${amount}</h3>
        <p className='text-sm text-gray-400'>{bidderName}</p>
      </div>
    </li>
  );
}
