'use client';

import useSortSearchParams from '@/lib/hooks/useSortSearchParams';
import { ListingFull } from '@/lib/schemas/listingSchema';
import { getAllListings } from '@/lib/services/getAllListings';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import AuctionGrid from './AuctionGrid';
import AuctionItemCard from './AuctionItemCard';
import Skeleton from './Skeleton';
import { Button } from './ui/button';
import { Card } from './ui/card';

const AllListingsGrid = () => {
  const router = useRouter();
  const skeletonArr = Array.from({ length: 30 }, (_, i) => i);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteListings();

  const [ref] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: isFetchingNextPage || !hasNextPage,
    rootMargin: '0px 0px 400px 0px',
  });

  if (isLoading) {
    return (
      <AuctionGrid>
        {skeletonArr.map((_skeleton, i) => (
          <Card key={i} className='h-96'>
            <Skeleton className='h-full' animationDelay={`0.${i}s`} />
          </Card>
        ))}
      </AuctionGrid>
    );
  }

  if (!data) {
    return (
      <div className='flex h-96 flex-col items-center justify-center'>
        <p className='text-2xl font-bold text-gray-400'>No listings found</p>
        <Button variant='outline' onClick={() => router.refresh()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <>
      <AuctionGrid>
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group.map((listing) => (
              <AuctionItemCard key={listing.id} listing={listing} />
            ))}
          </Fragment>
        ))}
      </AuctionGrid>
      {hasNextPage && <div ref={ref} />} {/* Infinite scroll sentinel */}
    </>
  );
};

export default AllListingsGrid;

const getCurrentPrice = (listing: ListingFull) => {
  if (listing.bids && listing.bids.length > 0) {
    return Math.max(...listing.bids.map((bid) => bid.amount));
  }
  return 0; // or some default value
};

const sortListingsByPrice = (listings: ListingFull[], order: string) => {
  return listings.sort((a, b) => {
    const priceA = getCurrentPrice(a);
    const priceB = getCurrentPrice(b);

    return order === 'asc' ? priceA - priceB : priceB - priceA;
  });
};

const useInfiniteListings = () => {
  const { sort, order } = useSortSearchParams();

  return useInfiniteQuery({
    queryKey: ['allListings', sort, order],
    queryFn: ({ pageParam = 0 }) =>
      getAllListings({ sort, order, limit: 100, offset: pageParam * 100 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 0) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
};
