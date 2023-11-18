'use client';

import useSortSearchParams from '@/lib/hooks/useSortSearchParams';
import { getAllListings } from '@/lib/services/getAllListings';
import { useQuery } from '@tanstack/react-query';
import AuctionItemCard from './AuctionItemCard';

const ListingsGrid = () => {
  const { sort, order } = useSortSearchParams();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['allListings', sort, order],
    queryFn: () =>
      getAllListings({
        sort,
        order,
      }),
  });

  if (!listings) {
    return null;
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-x-4 gap-y-6 pt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-8 xl:grid-cols-5'>
        {isLoading && (
          <div className='col-span-full flex justify-center'>
            <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900'></div>
          </div>
        )}

        {listings.map((listing) => (
          <AuctionItemCard key={listing.id} listing={listing} />
        ))}
      </div>
    </>
  );
};

export default ListingsGrid;
