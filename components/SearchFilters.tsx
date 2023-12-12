import Link from 'next/link';
import { badgeVariants } from './ui/badge';
import { Order, SearchParams, Sort } from '@/lib/services/types';
import { generateQueryObject } from '@/lib/utils';

type CommonOptions = {
  label: string;
  default?: boolean;
};

type SortOptions = {
  value: Sort | undefined;
} & CommonOptions;

type OrderOptions = {
  value: Order | undefined;
} & CommonOptions;

type Props = {
  searchParams: SearchParams;
  sortOptions: SortOptions[];
  orderOptions: OrderOptions[];
};

const SearchFilters = ({ searchParams, sortOptions, orderOptions }: Props) => {
  const { sort, order, q } = searchParams;

  return (
    <div className='flex w-full flex-col justify-center gap-4 sm:flex-row'>
      <div>
        <span className='text-xs'>Sort by</span>
        <div className='flex gap-2'>
          {sortOptions.map(({ value, label }) => (
            <FilterLink
              key={value}
              queryObject={{ sort: value, order, q }}
              current={sort}
              label={label}
              value={value}
            />
          ))}
        </div>
      </div>

      <div>
        <span className='text-xs'>Order</span>
        <div className='flex gap-2'>
          {orderOptions.map(({ value, label }) => (
            <FilterLink
              key={value}
              queryObject={{ sort, order: value, q }}
              current={order}
              label={label}
              value={value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;

type FilterLinkProps = {
  queryObject: SearchParams;
  current: string | undefined;
  label: string;
  value: string | undefined;
};

export const FilterLink = ({
  queryObject,
  current,
  label,
  value,
}: FilterLinkProps) => {
  const active = current === value;
  return (
    <Link
      href={{ query: generateQueryObject(queryObject) }}
      className={badgeVariants({
        variant: active ? 'secondary' : 'outline',
      })}
      replace
      data-testid={`filter-link${active ? '-active' : ''}`}
    >
      {label}
    </Link>
  );
};
