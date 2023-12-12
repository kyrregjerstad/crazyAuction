'use client';

import AuctionGrid from '@/components/AuctionGrid';
import AuctionItemCard from '@/components/AuctionItemCard';
import { getListings } from '@/lib/services/getListings';
import { useQuery } from '@tanstack/react-query';

type Props = {
  searchValue: string | undefined;
};
const SearchResults = ({ searchValue }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['allListings', 'endsAt', 'asc'],
    queryFn: () => getListings({ sort: 'endsAt', sortOrder: 'asc' }),
  });

  if (!searchValue) {
    return (
      <div className='w-full pt-12 text-center'>Search for something...</div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const filteredData = data.filter((listing) => {
    return listing.title.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <>
      {filteredData.length === 0 && (
        <div className='flex h-96 flex-col items-center justify-center'>
          <p className='text-2xl font-bold text-gray-400'>No listings found</p>
        </div>
      )}
      <AuctionGrid>
        {filteredData.map((listing) => (
          <AuctionItemCard key={listing.id} listing={listing} />
        ))}
      </AuctionGrid>
    </>
  );
};

export default SearchResults;
