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
    <div className='grid grid-cols-3 gap-4'>
      {listings.map((listing) => (
        <AuctionItemCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingsGrid;
