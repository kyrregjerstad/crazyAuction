'use client';

import useSortSearchParams from '@/lib/hooks/useSortSearchParams';
import { getAllListings } from '@/lib/services/getAllListings';
import { useQuery } from '@tanstack/react-query';
import AuctionItemCard from './AuctionItemCard';
import { Card } from './ui/card';
import Skeleton from './Skeleton';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const ListingsGrid = () => {
  const { sort, order } = useSortSearchParams();
  const router = useRouter();
  const skeletonArr = Array.from({ length: 30 }, (_, i) => i);

  const { data: listings, isLoading } = useQuery({
    queryKey: ['allListings', sort, order],
    queryFn: () =>
      getAllListings({
        sort,
        order,
      }),
  });

  if (isLoading) {
    return (
      <Grid>
        {skeletonArr.map((skeleton, i) => (
          <Card key={i} className='h-96'>
            <Skeleton className='h-full' animationDelay={`0.${i}s`} />
          </Card>
        ))}
      </Grid>
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

  return (
    <Grid>
      {listings.map((listing) => (
        <AuctionItemCard key={listing.id} listing={listing} />
      ))}
    </Grid>
  );
};

export default ListingsGrid;

const Grid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-6 pt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-8 xl:grid-cols-5'>
      {children}
    </div>
  );
};
