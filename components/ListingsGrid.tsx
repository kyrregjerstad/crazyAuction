'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllListings } from '@/lib/services/getAllListings';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import AuctionItemCard from './AuctionItemCard';

const ListingsGrid = () => {
  const [sort, setSort] = useState<Sorting>('endsAt');
  const [order, setOrder] = useState<SortingOrder>('asc');

  const { data: listings, isLoading } = useQuery({
    queryKey: ['allListings', sort, order],
    queryFn: () =>
      getAllListings({
        sort,
        sortOrder: order,
      }),
  });

  const handleSortChange = (newSort: Sorting) => {
    setSort(newSort);
  };

  const handleOrderChange = (newOrder: SortingOrder) => {
    setOrder(newOrder);
  };

  if (!listings) {
    return null;
  }

  return (
    <>
      <Filters
        onOrderChange={handleOrderChange}
        onSortChange={handleSortChange}
        sort={sort}
        order={order}
      />
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

type Sorting = 'endsAt' | 'created' | 'price';
type SortingOrder = 'asc' | 'desc';

const sortOptions: { value: Sorting; label: string; default?: boolean }[] = [
  { value: 'endsAt', label: 'Ending Time', default: true },
  { value: 'created', label: 'Creation Date' },
  { value: 'price', label: 'Price' },
];

const orderOptions: { value: SortingOrder; label: string }[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

type FiltersProps = {
  sort: Sorting;
  order: SortingOrder;
  onSortChange: (newSort: Sorting) => void;
  onOrderChange: (newOrder: SortingOrder) => void;
};
const Filters = ({
  sort,
  order,
  onSortChange,
  onOrderChange,
}: FiltersProps) => {
  return (
    <div className='flex gap-4'>
      <Select onValueChange={onSortChange} defaultValue={sort}>
        <SelectTrigger className='w-[160px]'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={onOrderChange} defaultValue={order}>
        <SelectTrigger className='w-[130px]'>
          <SelectValue placeholder='Order' />
        </SelectTrigger>
        <SelectContent>
          {orderOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
