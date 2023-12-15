'use client';

import ImageGallery from '@/components/ImageGallery';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bid } from '@/lib/schemas';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AnimatedButton from '@/components/AnimatedButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useMutateAuction from '@/lib/hooks/useMutateAuction';
import useQuerySingleAuction from '@/lib/hooks/useQuerySingleAuction';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import EndingTime from '@/components/EndingTime';
import { Trash2 } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

dayjs.extend(relativeTime);

type Props = {
  auctionId: string;
  isAuthenticated: boolean;
};
const SingleAuctionPage = ({
  auctionId: auctionId,
  isAuthenticated,
}: Props) => {
  const { data: auction, isLoading } = useQuerySingleAuction({
    auctionId,
  });

  const { deleteAuctionMutation, postBidMutation } = useMutateAuction({
    auctionId,
  });

  const router = useRouter();

  const {
    mutate: mutateBid,
    isPending: bidPending,
    variables: pendingAmount,
  } = postBidMutation;

  const { mutate: deleteAuction, isPending: deletePending } =
    deleteAuctionMutation;

  const { toast } = useToast();

  const isLoggedInUser = useIsLoggedInUser(auction?.seller.name);
  const startingBid = calculateStartingAmount(auction?.currentBid || 0);
  const [amount, setAmount] = useState(startingBid); // default to 10% more than the current bid (rounded), or 1 more than the current for low values

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!auction) {
    return (
      <div className='col-span-2 flex w-full justify-center text-center'>
        No listing found
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      deleteAuction();
      toast({
        title: 'Success',
        description: 'Auction deleted successfully',
        variant: 'success',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: `${JSON.stringify(error)}`,
        variant: 'error',
      });
    }
  };

  const { title, description, seller, media, bids, currentBid, active } =
    auction;

  return (
    <>
      <ImageGallery images={media} />
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        <div className='flex items-end text-xl font-bold text-white'>
          <div className='text-5xl' data-testid='current-bid'>
            ${' '}
            {bidPending ? (
              <span className='opacity-50'>{pendingAmount}</span>
            ) : (
              <span>{currentBid}</span>
            )}
          </div>
        </div>
        {isLoggedInUser && active ? (
          <div className='flex items-center gap-4'>
            <Link
              href={`/auction/?mode=edit&id=${auctionId}`}
              className={buttonVariants({ variant: 'accent' })}
            >
              Edit Listing
            </Link>
            <DeleteButton
              handleDelete={handleDelete}
              deletePending={deletePending}
            />
          </div>
        ) : (
          <div className='flex flex-col'>
            {active ? (
              <>
                <EndingTime endsAt={auction.endsAt} />
                {isAuthenticated ? (
                  <div className='flex w-full max-w-sm items-center space-x-2'>
                    <Input
                      type='number'
                      placeholder={`${Math.round(currentBid * 1.1)}`}
                      className='w-24'
                      min={currentBid + 1}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      value={amount}
                      disabled={!isAuthenticated || bidPending}
                    />

                    <AnimatedButton
                      isLink={false}
                      variant='magic'
                      repeat={true}
                      className='w-18'
                      onClick={() => {
                        mutateBid(amount);
                      }}
                      disabled={
                        !isAuthenticated || bidPending || amount < currentBid
                      }
                    >
                      Place a bid
                    </AnimatedButton>
                  </div>
                ) : (
                  <p className='text-sm text-gray-400'>
                    You must be logged in to place a bid
                  </p>
                )}
              </>
            ) : (
              <>
                <p className='text-sm text-gray-400'>This auction has ended</p>
              </>
            )}
          </div>
        )}
        <p className='text-lg'>{description}</p>
        <div className='rounded-lg bg-zinc-800/50 p-6'>
          <h2 className='text-xl font-semibold'>Seller Information</h2>
          <div className='mt-4 flex items-center gap-2'>
            {seller.avatar ? (
              <Avatar className='h-8 w-8 border border-accent'>
                <AvatarImage src={seller.avatar} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
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
            )}
            <span className='font-medium'>
              <Link
                href={`/user/${seller.name}`}
                className='hover:underline'
                data-testid='seller'
              >
                {seller.name}
              </Link>
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
        <BidHistory bids={bids} isAuthenticated={isAuthenticated} />
      </div>
    </>
  );
};

export default SingleAuctionPage;

const BidHistory = ({
  bids,
  isAuthenticated,
}: {
  bids?: Bid[];
  isAuthenticated: boolean;
}) => {
  if (!isAuthenticated) {
    return (
      <div className='w-full max-w-md rounded-lg p-6 text-foreground'>
        <h2 className='mb-6 text-lg font-semibold'>Bid History</h2>
        <div className='relative m-3 leading-loose'>
          <div className='flex h-32 items-center justify-center'>
            <p className='text-gray-400'>
              You must be logged in to view bid history
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <div className='w-full max-w-md rounded-lg p-6 text-foreground'>
        <h2 className='mb-6 text-lg font-semibold'>Bid History</h2>
        <div className='relative m-3 leading-loose'>
          <div className='absolute left-[10px] top-2 h-full w-[2px]  bg-gradient-to-b from-accent' />
          <div className='flex h-32 items-center justify-center'>
            <p className='text-gray-400'>No bids yet</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='w-full max-w-md rounded-lg p-6 text-foreground'>
      <h2 className='mb-6 text-lg font-semibold'>Bid History</h2>
      <div className='relative m-3 leading-loose'>
        <div className='absolute left-[10px] top-2 h-full w-[2px]  bg-gradient-to-b from-accent' />
        <ScrollArea className='h-96'>
          <ul className='list-none'>
            {bids.map((bid, index) => (
              <BidHistoryItem key={bid.id} bid={bid} index={index} />
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
};

const BidHistoryItem = ({ bid, index }: { bid: Bid; index: number }) => {
  const { created, amount, bidderName } = bid;

  const bidDate = dayjs(created).fromNow();
  return (
    <li className='mb-3'>
      <div className={`mb-1 flex items-center`}>
        <div
          className={cn(
            index === 0 ? 'bg-accent' : 'bg-gray-600',
            'z-10 h-6 w-6 rounded-full',
          )}
        />
        <div className='ml-4 flex-1 font-medium'>{bidDate}</div>
      </div>
      <div className='pl-12 leading-none'>
        <h3 className='font-semibold '>${amount}</h3>
        <Link
          className='text-sm text-gray-400 hover:underline'
          href={`/user/${bidderName}`}
        >
          {bidderName}
        </Link>
      </div>
    </li>
  );
};

const useIsLoggedInUser = (username: string | undefined) => {
  const session = useSession();
  const { data } = session;
  if (!username || !data) {
    return false;
  }
  return session.status === 'authenticated' && data.user.name === username;
};

const calculateStartingAmount = (currentBid: number) =>
  Math.max(Math.round(currentBid * 1.1), currentBid + 1);

const DeleteButton = ({
  handleDelete,
  deletePending,
}: {
  handleDelete: () => Promise<void>;
  deletePending: boolean;
}) => {
  return (
    <Button onClick={handleDelete} disabled={deletePending} variant='text'>
      <Trash2 />
      <span className='sr-only'>Delete Auction</span>
    </Button>
  );
};
