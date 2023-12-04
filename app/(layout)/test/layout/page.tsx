'use client';

import AuctionGrid from '@/components/AuctionGrid';
import AuctionItemCard from '@/components/AuctionItemCard';
import {
  AuctionEnds,
  generateSampleData,
  TimeIntervals,
} from '@/lib/data/generateSampleData';
import { ListingFull } from '@/lib/schemas/listing';

// use this page to test components at different sizes, colors, etc.

const singleAuction = generateSampleData({
  endsAt: AuctionEnds.past.fiveSeconds,
});

const generateMultipleSampleData = (count: number): ListingFull[] =>
  Array.from({ length: count }, generateSampleData);

const TestingPage = () => {
  const sampleData = generateMultipleSampleData(4);

  return (
    <div className='w-full max-w-7xl  p-2  sm:p-4'>
      <div className='grid grid-cols-8 gap-4'>
        <div className='bg-accent-50 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-100 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-200 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-300 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-400 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-500 aspect-[4/6] rounded-md border border-white' />
        <div className='bg-accent-600 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-700 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-800 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-900 aspect-[4/6] rounded-md border border-accent' />
        <div className='bg-accent-950 aspect-[4/6] rounded-md border border-accent' />
      </div>
    </div>
  );
};

export default TestingPage;
