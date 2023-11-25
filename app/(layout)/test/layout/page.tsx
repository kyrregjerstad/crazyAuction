'use client';
import AuctionGrid from '@/components/AuctionGrid';
import AuctionItemCard from '@/components/AuctionItemCard';
import {
  AuctionEndsIn,
  generateSampleData,
} from '@/lib/data/generateSampleData';
import { ListingFull } from '@/lib/schemas/listing';

// use this page to test components at different sizes, colors, etc.

const singleAuction = generateSampleData({
  endsAt: AuctionEndsIn.oneHour,
});

console.log(singleAuction.endsAt);

const generateMultipleSampleData = (count: number): ListingFull[] =>
  Array.from({ length: count }, generateSampleData);

const TestingPage = () => {
  const sampleData = generateMultipleSampleData(1);

  return (
    <div className='w-full max-w-7xl p-2 sm:p-4 '>
      <AuctionGrid>
        {sampleData.map((listing) => (
          <AuctionItemCard key={listing.id} listing={singleAuction} />
        ))}
      </AuctionGrid>
    </div>
  );
};

export default TestingPage;
