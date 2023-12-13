import { render, screen } from '@testing-library/react';
import SearchFilters, { FilterLink } from './SearchFilters';

import { Order, Sort } from '@/lib/services/auction-api/types';

const searchParams = { sort: 'price', order: 'asc', q: 'test' } as const;

describe('SearchFilters', () => {
  it('renders sort and order options correctly', () => {
    const sortOptions: { value: Sort; label: string }[] = [
      { value: 'price', label: 'Price' },
      { value: 'name', label: 'Name' },
      { value: 'endsAt', label: 'Ends at' },
    ];
    const orderOptions: { value: Order; label: string }[] = [
      { value: 'asc', label: 'Ascending' },
      { value: 'desc', label: 'Descending' },
    ];

    render(
      <SearchFilters
        searchParams={searchParams}
        sortOptions={sortOptions}
        orderOptions={orderOptions}
      />,
    );

    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Ends at')).toBeInTheDocument();
    expect(screen.getByText('Ascending')).toBeInTheDocument();
    expect(screen.getByText('Descending')).toBeInTheDocument();
  });
});

describe('FilterLink', () => {
  it('renders correctly', () => {
    const current = 'price';
    const label = 'Price';
    const value = 'price';

    render(
      <FilterLink
        queryObject={searchParams}
        current={current}
        label={label}
        value={value}
      />,
    );

    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('renders correctly when current is undefined', () => {
    const current = undefined;
    const label = 'Price';
    const value = 'price';

    render(
      <FilterLink
        queryObject={searchParams}
        current={current}
        label={label}
        value={value}
      />,
    );

    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('renders correctly when current is not equal to value', () => {
    const current = 'name';
    const label = 'Price';
    const value = 'price';

    render(
      <FilterLink
        queryObject={searchParams}
        current={current}
        label={label}
        value={value}
      />,
    );

    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('sets the active class when current is equal to value', () => {
    const current = 'price';
    const label = 'Price';
    const value = 'price';

    render(
      <FilterLink
        queryObject={searchParams}
        current={current}
        label={label}
        value={value}
      />,
    );

    expect(screen.getByTestId('filter-link-active')).toBeInTheDocument();
  });

  it('does not set the active class when current is not equal to value', () => {
    const current = 'name';
    const label = 'Price';
    const value = 'price';

    render(
      <FilterLink
        queryObject={searchParams}
        current={current}
        label={label}
        value={value}
      />,
    );

    expect(screen.getByTestId('filter-link')).toBeInTheDocument();
  });
});
