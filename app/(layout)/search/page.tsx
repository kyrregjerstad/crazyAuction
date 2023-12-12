import { getListings } from '@/lib/services/getListings';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import React from 'react';
import SearchResults from './SearchResults';
import { getAllListings } from '@/lib/services/getAllListings';
import SearchFilters from '@/components/SearchFilters';
import { searchOrderOptions, searchSortOptions } from '@/lib/constants';
import { SearchParams } from '@/lib/services/types';

type Props = {
  searchParams?: SearchParams;
};

const SearchPage = async ({ searchParams }: Props) => {
  const { q, order, sort } = searchParams || {};

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['allListings', sort, order],
    queryFn: () => getListings({ sort, sortOrder: order }),
  });

  return (
    <div className='w-full max-w-7xl p-2 sm:p-4'>
      <SearchFilters
        searchParams={{ sort, order, q }}
        sortOptions={searchSortOptions}
        orderOptions={searchOrderOptions}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchResults searchValue={q} />
      </HydrationBoundary>
    </div>
  );
};

export default SearchPage;
