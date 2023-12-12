import SearchFilters from '@/components/SearchFilters';
import { searchOrderOptions, searchSortOptions } from '@/lib/constants';
import { getListings } from '@/lib/services/getListings';
import { SearchParams } from '@/lib/services/types';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import SearchResults from './SearchResults';

type Props = {
  searchParams?: SearchParams;
};

const SearchPage = async ({ searchParams }: Props) => {
  const { q, order = 'asc', sort = 'endsAt' } = searchParams || {};

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
        <SearchResults searchParams={searchParams} />
      </HydrationBoundary>
    </div>
  );
};

export default SearchPage;
