import { useSearchParams } from 'next/navigation';
import { Order, Sort } from '../services/types';
import { searchOrderOptions, searchSortOptions } from '../constants';

const useSortSearchParams = () => {
  const searchParams = useSearchParams();

  let sort = searchParams.get('sort') as Sort | undefined;
  let order = searchParams.get('order') as Order | undefined;

  if (!sort) {
    sort = 'endsAt';
  }

  if (!order) {
    order = 'asc';
  }

  if (sort && !searchSortOptions.find((option) => option.value === sort)) {
    sort = 'endsAt';
  }

  if (order && !searchOrderOptions.find((option) => option.value === order)) {
    order = 'asc';
  }

  return {
    sort,
    order,
  };
};

export default useSortSearchParams;
