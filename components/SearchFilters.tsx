import Link from 'next/link';
import { badgeVariants } from './ui/badge';
import { SearchParams } from '@/lib/services/types';

const SearchFilters = ({ sort, order, active }: SearchParams) => {
  sort = sort || 'endsAt';
  order = order || 'asc';
  return (
    <div className='flex w-full flex-col justify-center gap-4 sm:flex-row'>
      <div>
        <span className='text-xs'>Sort by</span>
        <div className='flex gap-2'>
          {sortOptions.map(({ value, label }) => (
            <Link
              key={value}
              href={`?sort=${value || 'endsAt'}&order=${order || 'asc'}`}
              className={badgeVariants({
                variant: value === sort ? 'secondary' : 'outline',
              })}
              replace
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <span className='text-xs'>Order</span>
        <div className='flex gap-2'>
          {orderOptions.map(({ value, label }) => (
            <Link
              key={value}
              href={`?sort=${sort || 'endsAt'}&order=${value || 'asc'}`}
              className={badgeVariants({
                variant: value === order ? 'secondary' : 'outline',
              })}
              replace
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;

export type Sorting = 'endsAt' | 'created' | 'price';
export type SortingOrder = 'asc' | 'desc';

export const sortOptions: {
  value: Sorting;
  label: string;
  default?: boolean;
}[] = [
  { value: 'endsAt', label: 'Ending Time', default: true },
  { value: 'created', label: 'Creation Date' },
  { value: 'price', label: 'Price' },
];

export const orderOptions: { value: SortingOrder; label: string }[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];
