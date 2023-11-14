import { Button } from '@/components/ui/button';
import useGetSingleAuctionItem from '@/lib/hooks/useGetSingleAuctionItem';
import { getServerSession } from 'next-auth';
import React from 'react';

interface Props {
  params: { id: string };
}

const ItemDetailsPage = async ({ params }: Props) => {
  const session = await getServerSession();

  const auctionItem = await useGetSingleAuctionItem(params.id);

  if (!auctionItem) return null;

  return (
    <div className='mx-auto max-w-5xl p-8'>
      <div className='grid items-start gap-8 md:grid-cols-2'>
        <div className='relative space-y-4'>
          <div className='aspect-w-1 aspect-h-2 md:aspect-h-1 relative'>
            <img
              alt='Product Image Main'
              className='rounded-lg object-cover'
              height='500'
              src={auctionItem.media.at(0) || ''}
              style={{
                aspectRatio: '1',
                objectFit: 'cover',
              }}
              width='500'
            />
            <button className='absolute left-0 top-1/2 -translate-y-1/2 transform rounded-r-lg bg-black bg-opacity-50 p-2 text-white'>
              <svg
                className=' h-6 w-6'
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
                <path d='m15 18-6-6 6-6' />
              </svg>
            </button>
            <button className='absolute right-0 top-1/2 -translate-y-1/2 transform rounded-l-lg bg-black bg-opacity-50 p-2 text-white'>
              <svg
                className=' h-6 w-6'
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
                <path d='m9 18 6-6-6-6' />
              </svg>
            </button>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='aspect-w-1 aspect-h-1'>
              <img
                alt='Product Image 1'
                className='cursor-pointer rounded-lg object-cover'
                height='200'
                src={auctionItem.media.at(0) || ''}
                style={{
                  aspectRatio: '1',
                  objectFit: 'cover',
                }}
                width='200'
              />
            </div>
            <div className='aspect-w-1 aspect-h-1'>
              <img
                alt='Product Image 2'
                className='cursor-pointer rounded-lg object-cover'
                height='200'
                src={auctionItem.media.at(0) || ''}
                style={{
                  aspectRatio: '1',
                  objectFit: 'cover',
                }}
                width='200'
              />
            </div>
            <div className='aspect-w-1 aspect-h-1'>
              <img
                alt='Product Image 3'
                className='cursor-pointer rounded-lg object-cover'
                height='200'
                src={auctionItem.media.at(0) || ''}
                style={{
                  aspectRatio: '1',
                  objectFit: 'cover',
                }}
                width='200'
              />
            </div>
          </div>
        </div>
        <div className='space-y-6'>
          <h1 className='text-3xl font-bold'>{auctionItem.title}</h1>
          <div className='text-5xl font-bold text-white'>
            Current Bid: ${auctionItem.bids.at(-1)?.amount}
          </div>
          <Button className='bg-accent text-white' variant='default'>
            Place a bid
          </Button>
          <p className='text-lg'>{auctionItem.description}</p>
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
              <span className='font-medium'>{auctionItem.seller.name}</span>
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
      </div>
    </div>
  );
};

export default ItemDetailsPage;
