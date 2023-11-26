'use client';

import useSortSearchParams from '@/lib/hooks/useSortSearchParams';
import { getAllListings } from '@/lib/services/getAllListings';
import { useQuery } from '@tanstack/react-query';
import AuctionItemCard from './AuctionItemCard';
import { Card } from './ui/card';
import Skeleton from './Skeleton';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import AuctionGrid from './AuctionGrid';
import { ListingFull } from '@/lib/schemas/listing';

const ListingsGrid = () => {
  const { sort, order } = useSortSearchParams();
  const router = useRouter();
  const skeletonArr = Array.from({ length: 30 }, (_, i) => i);

  const { data: listings, isLoading } = useQuery({
    queryKey: ['allListings', sort, order],
    queryFn: () =>
      getAllListings({
        sort: sort === 'endsAt' ? 'endsAt' : 'created',
        order,
      }),
  });

  const getCurrentPrice = (listing: ListingFull) => {
    if (listing.bids && listing.bids.length > 0) {
      return Math.max(...listing.bids.map((bid) => bid.amount));
    }
    return 0; // or some default value
  };

  const sortListingsByPrice = (listings: ListingFull[]) => {
    return listings.sort((a, b) => {
      const priceA = getCurrentPrice(a);
      const priceB = getCurrentPrice(b);

      return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
  };

  if (isLoading) {
    return (
      <AuctionGrid>
        {skeletonArr.map((skeleton, i) => (
          <Card key={i} className='h-96'>
            <Skeleton className='h-full' animationDelay={`0.${i}s`} />
          </Card>
        ))}
      </AuctionGrid>
    );
  }

  if (!listings) {
    return (
      <div className='flex h-96 flex-col items-center justify-center'>
        <p className='text-2xl font-bold text-gray-400'>No listings found</p>
        <Button variant='outline' onClick={() => router.refresh()}>
          Try again
        </Button>
      </div>
    );
  }

  const sortedListings =
    sort === 'price' ? sortListingsByPrice([...listings]) : listings;

  return (
    <AuctionGrid>
      {sortedListings.map((listing) => (
        <AuctionItemCard key={listing.id} listing={listing} />
      ))}
    </AuctionGrid>
  );
};

export default ListingsGrid;
