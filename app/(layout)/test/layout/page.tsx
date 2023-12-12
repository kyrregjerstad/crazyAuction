'use client';

import AuctionGrid from '@/components/AuctionGrid';
import AuctionItemCard from '@/components/AuctionItemCard';
// import {
//   AuctionEnds,
//   generateSampleData,
//   TimeIntervals,
// } from '@/lib/data/generateSampleData';
import { ListingFull } from '@/lib/schemas/listingSchema';
// import dynamic from 'next/dynamic';

// use this page to test components at different sizes, colors, etc.

// const singleAuction = generateSampleData({
//   endsAt: AuctionEnds.past.fiveSeconds,
// });

// const generateMultipleSampleData = (count: number): ListingFull[] =>
//   Array.from({ length: count }, generateSampleData);

const TestingPage = () => {
  // const sampleData = generateMultipleSampleData(4);

  return (
    <div className='w-full max-w-7xl  p-2  sm:p-4'>
      <div className='grid grid-cols-8 gap-4'>
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-50' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-100' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-200' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-300' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-400' />
        <div className='aspect-[4/6] rounded-md border border-white bg-accent-500' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-600' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-700' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-800' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-900' />
        <div className='aspect-[4/6] rounded-md border border-accent bg-accent-950' />
      </div>
    </div>
  );
};

export default TestingPage;
