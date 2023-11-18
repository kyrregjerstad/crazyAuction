import {
  Sorting,
  SortingOrder,
  orderOptions,
  sortOptions,
} from '@/components/SearchFilters';
import { useSearchParams } from 'next/navigation';

const useSortSearchParams = () => {
  const searchParams = useSearchParams();

  let sort = searchParams.get('sort') as Sorting | undefined;
  let order = searchParams.get('order') as SortingOrder | undefined;

  if (!sort) {
    sort = 'endsAt';
  }

  if (!order) {
    order = 'asc';
  }

  if (sort && !sortOptions.find((option) => option.value === sort)) {
    sort = 'endsAt';
  }

  if (order && !orderOptions.find((option) => option.value === order)) {
    order = 'asc';
  }

  return {
    sort,
    order,
  };
};

export default useSortSearchParams;
