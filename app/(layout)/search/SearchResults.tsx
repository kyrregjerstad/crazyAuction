'use client';

import AuctionGrid from '@/components/AuctionGrid';
import AuctionItemCard from '@/components/AuctionItemCard';
import { getAuctions } from '@/lib/services/auction-api';
import { SearchParams } from '@/lib/services/auction-api/types';
import { useQuery } from '@tanstack/react-query';

type Props = {
  searchParams: SearchParams | undefined;
};
const SearchResults = ({ searchParams }: Props) => {
  const { q: searchValue, order, sort } = searchParams || {};

  const { data, isLoading } = useQuery({
    queryKey: ['allListings', sort, order],
    queryFn: () => getAuctions({ sort: 'endsAt', sortOrder: 'asc' }),
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
