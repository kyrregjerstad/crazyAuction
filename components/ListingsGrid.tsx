'use client';
import { getAllListings } from '@/lib/services/getAllListings';
import { useQuery } from '@tanstack/react-query';
import AuctionItemCard from './AuctionItemCard';

const ListingsGrid = () => {
  const { data: listings, isLoading } = useQuery({
    queryKey: ['allListings'],
    queryFn: getAllListings,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!listings) {
    return <div>No listings found</div>;
  }

  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-8 xl:grid-cols-5'>
      {listings.map((listing) => (
        <AuctionItemCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingsGrid;
